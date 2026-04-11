/**
 * migrate-to-wp.ts
 *
 * Data Migration Script: src/data JSON → WordPress (via REST API)
 *
 * Usage:
 *   npx tsx scripts/migrate-to-wp.ts
 *
 * Prerequisites:
 *   1. WordPress installed on Hostinger
 *   2. Plugins installed: ACF PRO, CPT UI, WPGraphQL, WPGraphQL for ACF
 *   3. JWT Authentication plugin installed (OR use Application Passwords)
 *   4. CPTs registered: serum, ingredient, brand
 *   5. ACF field groups created with correct slugs
 *   6. Fill in WP_URL, WP_USER, WP_PASS in .env (or pass as env vars)
 *
 * What it does:
 *   - Reads src/data/serums.json and src/data/ingredients.json
 *   - Creates Brand CPT posts for each unique brand
 *   - Creates Serum CPT posts with all ACF fields
 *   - Creates Ingredient CPT posts with all ACF fields
 *   - Skips duplicates (checks by slug)
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file manually (tsx doesn't auto-load it)
const envPath = path.join(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

// ── Config ────────────────────────────────────────────────────────────────────

const WP_URL = process.env.WP_URL?.replace(/\/$/, "") ?? "https://your-wp-site.com";
const WP_USER = process.env.WP_MIGRATE_USER ?? "admin";          // WP admin username
const WP_PASS = process.env.WP_MIGRATE_PASS ?? "your-app-password"; // WP Application Password

// WordPress Application Password format: "xxxx xxxx xxxx xxxx xxxx xxxx"
const AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

const REST = `${WP_URL}/wp-json/wp/v2`;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function wpPost(endpoint: string, body: object): Promise<any> {
  const res = await fetch(`${REST}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${AUTH}`,
    },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) {
    // 'post_already_exists' or duplicate slug — treat as non-fatal
    if (json.code === "duplicate_slug" || res.status === 409) return json;
    throw new Error(`WP REST error [${res.status}]: ${JSON.stringify(json)}`);
  }
  return json;
}

async function wpGet(endpoint: string): Promise<any[]> {
  const res = await fetch(`${REST}${endpoint}`, {
    headers: { Authorization: `Basic ${AUTH}` },
  });
  if (!res.ok) return [];
  return res.json();
}

/** Fetch existing posts by slug to avoid duplicates */
async function existingBySlug(cpt: string): Promise<Set<string>> {
  const posts = await wpGet(`/${cpt}?per_page=100&status=any`);
  return new Set(posts.map((p: any) => p.slug));
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

// ── Load JSON Data ─────────────────────────────────────────────────────────────

const serumsRaw: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/serums.json"), "utf-8")
);
const ingredientsRaw: any[] = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../src/data/ingredients.json"), "utf-8")
);

// ── Vitamin C Type Mapper ──────────────────────────────────────────────────────
// JSON data uses shorthand codes; ACF dropdown expects full names

const VITAMIN_C_TYPE_MAP: Record<string, string> = {
  // Shorthand → Full name (must match ACF dropdown choices exactly)
  "LAA":  "L-Ascorbic Acid",
  "AA":   "L-Ascorbic Acid",
  "AG":   "Ascorbyl Glucoside",
  "SAP":  "Sodium Ascorbyl Phosphate",
  "SAP ": "Sodium Ascorbyl Phosphate",
  "ATIP": "Ascorbyl Tetraisopalmitate",
  "MAP":  "Magnesium Ascorbyl Phosphate",
  "EAA":  "Ethyl Ascorbic Acid",
  "3-O-Ethyl Ascorbic Acid": "Ethyl Ascorbic Acid",
  // Pass-through if already full name
  "L-Ascorbic Acid": "L-Ascorbic Acid",
  "Ascorbyl Glucoside": "Ascorbyl Glucoside",
  "Sodium Ascorbyl Phosphate": "Sodium Ascorbyl Phosphate",
  "Ascorbyl Tetraisopalmitate": "Ascorbyl Tetraisopalmitate",
  "Magnesium Ascorbyl Phosphate": "Magnesium Ascorbyl Phosphate",
  "Ethyl Ascorbic Acid": "Ethyl Ascorbic Acid",
};

function normalizeVitaminCType(raw: string): string {
  if (!raw) return "L-Ascorbic Acid";
  const mapped = VITAMIN_C_TYPE_MAP[raw.trim()];
  if (mapped) return mapped;
  const lower = raw.trim().toLowerCase();
  const found = Object.values(VITAMIN_C_TYPE_MAP).find(
    (v) => v.toLowerCase() === lower
  );
  return found ?? "L-Ascorbic Acid";
}

// Valid ACF dropdown choices for ingredient type
const VALID_INGREDIENT_TYPES = [
  "Antioxidant", "Brightening", "Humectant", "Emollient",
  "Preservative", "pH Adjuster", "Stabilizer", "Penetration Enhancer", "Other"
];

function normalizeIngredientType(raw: string): string {
  if (!raw) return "Other";
  const trimmed = raw.trim();
  // Direct match
  if (VALID_INGREDIENT_TYPES.includes(trimmed)) return trimmed;
  // Case-insensitive match
  const lower = trimmed.toLowerCase();
  const found = VALID_INGREDIENT_TYPES.find((t) => t.toLowerCase() === lower);
  if (found) return found;
  // Partial/fuzzy matches for common cases
  if (lower.includes("antioxidant")) return "Antioxidant";
  if (lower.includes("bright")) return "Brightening";
  if (lower.includes("humect")) return "Humectant";
  if (lower.includes("emol")) return "Emollient";
  if (lower.includes("ph") || lower.includes("acid")) return "pH Adjuster";
  if (lower.includes("stab")) return "Stabilizer";
  if (lower.includes("penetrat") || lower.includes("enhanc")) return "Penetration Enhancer";
  if (lower.includes("preserv")) return "Preservative";
  return "Other"; // fallback
}

// ── Migration Functions ────────────────────────────────────────────────────────

async function migrateBrands(): Promise<Record<string, number>> {
  console.log("\n📦  Migrating Brands...");
  const existing = await existingBySlug("brand");
  const brandIdMap: Record<string, number> = {}; // brandName → WP post ID

  const uniqueBrands = [...new Set(serumsRaw.map((s) => s.brand as string))];

  for (const brandName of uniqueBrands) {
    const slug = slugify(brandName);
    if (existing.has(slug)) {
      console.log(`  ⏭️  Brand already exists: ${brandName}`);
      // Fetch the existing post ID
      const posts = await wpGet(`/brand?slug=${slug}`);
      if (posts.length > 0) brandIdMap[brandName] = posts[0].id;
      continue;
    }

    const post = await wpPost("/brand", {
      title: brandName,
      slug,
      status: "publish",
      // ACF fields — field keys match your ACF field group "brand_data"
      acf: {
        website: "",
        logo: null,
      },
    });

    if (post.id) {
      brandIdMap[brandName] = post.id;
      console.log(`  ✅  Brand created: ${brandName} (ID: ${post.id})`);
    }
  }

  return brandIdMap;
}

async function migrateSerums(brandIdMap: Record<string, number>): Promise<void> {
  console.log("\n💊  Migrating Serums...");
  const existing = await existingBySlug("serum");
  let created = 0;
  let skipped = 0;

  for (const s of serumsRaw) {
    if (existing.has(s.slug)) {
      console.log(`  ⏭️  Serum already exists: ${s.name}`);
      skipped++;
      continue;
    }

    const brandWpId = brandIdMap[s.brand];

    // Normalize scores
    const scores = {
      total: s.scores?.total ?? 0,
      efficacy: s.scores?.ingredient ?? s.scores?.efficacy ?? 0,
      stability: s.scores?.stability ?? 0,
      formulation: s.scores?.packaging ?? s.scores?.formulation ?? 0,
      value: s.scores?.value ?? 0,
    };

    // Convert arrays to ACF Repeater format
    const badges  = (s.badges ?? []).map((b: string) => ({ badge_name: b }));
    const concerns = (s.concerns ?? []).map((c: string) => ({ concern: c }));
    const pros    = (s.pros ?? []).map((p: string) => ({ pro: p }));
    const cons    = (s.cons ?? []).map((c: string) => ({ con: c }));
    const keyIngredients = (s.key_ingredients ?? []).map((i: string) => ({ ingredient_name: i }));

    const post = await wpPost("/serum", {
      title: s.name,
      slug: s.slug,
      status: "publish",
      // ACF fields — field keys match your ACF field group "serum_data"
      acf: {
        tagline: s.tagline ?? "",
        brand: brandWpId ?? null,      // Post Object field (stores WP post ID)
        image_url: s.image_url ?? "",  // Image URL (or upload to WP Media Library separately)
        price: s.price ?? 0,
        volume_ml: s.volume_ml ?? 0,
        vitamin_c_type: normalizeVitaminCType(s.vitamin_c_type ?? ""),
        concentration_percent: s.concentration_percent ?? 0,
        ph_level: s.ph_level ?? 0,
        rank: s.rank ?? 99,
        is_featured: s.is_featured ?? false,
        dermatologist_verdict: s.dermatologist_verdict ?? "",
        // Group field
        scores,
        // Repeater fields
        badges,
        concerns,
        skin_types: s.skin_types ?? [],  // Checkbox — array of values
        pros,
        cons,
        key_ingredients: keyIngredients,
        // Group field
        buy_links: {
          amazon:   s.buy_links?.amazon ?? "",
          flipkart: s.buy_links?.flipkart ?? "",
          nykaa:    s.buy_links?.nykaa ?? "",
          myntra:   s.buy_links?.myntra ?? "",
          purplle:  s.buy_links?.purplle ?? "",
        },
      },
    });

    if (post.id) {
      created++;
      console.log(`  ✅  Serum created: ${s.name} (ID: ${post.id})`);
    } else {
      console.warn(`  ⚠️  Serum failed: ${s.name}`, post);
    }
  }

  console.log(`\n  📊  Serums: ${created} created, ${skipped} skipped`);
}

async function migrateIngredients(): Promise<void> {
  console.log("\n🧪  Migrating Ingredients...");
  const existing = await existingBySlug("ingredient");
  let created = 0;
  let skipped = 0;

  for (const i of ingredientsRaw) {
    if (existing.has(i.slug)) {
      console.log(`  ⏭️  Ingredient already exists: ${i.name}`);
      skipped++;
      continue;
    }

    // Convert arrays to ACF Repeater format
    const bestFor  = (Array.isArray(i.best_for)  ? i.best_for  : [i.best_for] ).filter(Boolean).map((x: string) => ({ item: x }));
    const avoidIf  = (Array.isArray(i.avoid_if)  ? i.avoid_if  : [i.avoid_if] ).filter(Boolean).map((x: string) => ({ item: x }));
    const synergies = (Array.isArray(i.synergies) ? i.synergies : [i.synergies]).filter(Boolean).map((x: string) => ({ item: x }));
    const conflicts = (Array.isArray(i.conflicts) ? i.conflicts : [i.conflicts]).filter(Boolean).map((x: string) => ({ item: x }));

    const post = await wpPost("/ingredient", {
      title: i.name,
      slug: i.slug,
      status: "publish",
      // ACF fields — field keys match your ACF field group "ingredient_data"
      acf: {
        alias: i.alias ?? "",
        type: normalizeIngredientType(i.type ?? ""),
        description: i.description ?? "",
        stability_rating: i.stability_rating ?? 5,
        irritation_risk: (["Low","Medium","High"].includes(i.irritation_risk ?? "") ? i.irritation_risk : (i.irritation_risk?.toLowerCase().includes("high") ? "High" : i.irritation_risk?.toLowerCase().includes("med") ? "Medium" : "Low")) ?? "Low",
        bioavailability: i.bioavailability ?? 5,
        ph_required: i.ph_required ?? "Any",
        best_for: bestFor,
        avoid_if: avoidIf,
        synergies,
        conflicts,
      },
    });

    if (post.id) {
      created++;
      console.log(`  ✅  Ingredient created: ${i.name} (ID: ${post.id})`);
    } else {
      console.warn(`  ⚠️  Ingredient failed: ${i.name}`, post);
    }
  }

  console.log(`\n  📊  Ingredients: ${created} created, ${skipped} skipped`);
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀  Vitamin C → WordPress Migration Script");
  console.log(`📡  Target: ${WP_URL}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Verify connection
  try {
    const res = await fetch(`${REST}`, {
      headers: { Authorization: `Basic ${AUTH}` },
    });
    if (!res.ok) throw new Error(`REST API returned ${res.status}`);
    console.log("✅  WordPress REST API connection OK");
  } catch (e) {
    console.error("❌  Cannot connect to WordPress REST API:", e);
    console.error("   → Check WP_URL, WP_MIGRATE_USER, WP_MIGRATE_PASS");
    process.exit(1);
  }

  const brandIdMap = await migrateBrands();
  await migrateSerums(brandIdMap);
  await migrateIngredients();

  console.log("\n🎉  Migration complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Next steps:");
  console.log("  1. Go to WordPress Admin → verify all posts are created");
  console.log("  2. Update WP_GRAPHQL_URL in .env with your Hostinger URL");
  console.log("  3. Run: npm run dev  →  test frontend with WP data");
}

main().catch((e) => {
  console.error("❌  Migration failed:", e);
  process.exit(1);
});
