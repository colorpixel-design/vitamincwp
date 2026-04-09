import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

// ESM fix — __dirname not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱  Starting database seed...\n");

  // ── 1. Create Admin User ───────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@vitaminc.in" },
    update: {},
    create: {
      name: "VitaminC Admin",
      email: "admin@vitaminc.in",
      password: adminPassword,
      role: "MASTER_ADMIN",
    },
  });
  console.log(`✅  Admin user: ${admin.email}`);

  // Demo content creator
  const creatorPassword = await bcrypt.hash("Creator@123", 12);
  const creator = await prisma.user.upsert({
    where: { email: "editor@vitaminc.in" },
    update: {},
    create: {
      name: "Content Editor",
      email: "editor@vitaminc.in",
      password: creatorPassword,
      role: "CONTENT_CREATOR",
    },
  });
  console.log(`✅  Content creator: ${creator.email}`);

  // ── 2. Create Categories ───────────────────────────────────────
  const categoriesData = [
    { name: "Brightening", slug: "brightening", description: "Reduces dullness and enhances skin radiance", color: "#F59E0B" },
    { name: "Hyperpigmentation", slug: "hyperpigmentation", description: "Targets dark spots and uneven skin tone", color: "#8B5CF6" },
    { name: "Anti-Aging", slug: "anti-aging", description: "Reduces fine lines and boosts collagen", color: "#1E5FA3" },
    { name: "Acne", slug: "acne", description: "Fights acne-causing bacteria and post-acne marks", color: "#10B981" },
    { name: "Hydration", slug: "hydration", description: "Deep moisture for dry and dehydrated skin", color: "#06B6D4" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }
  console.log(`✅  ${categoriesData.length} categories created`);

  // ── 3. Load and parse JSON data ────────────────────────────────
  const serumsPath = path.join(__dirname, "../src/data/serums.json");
  const ingredientsPath = path.join(__dirname, "../src/data/ingredients.json");

  const serumsRaw: any[] = JSON.parse(fs.readFileSync(serumsPath, "utf-8"));
  const ingredientsRaw: any[] = JSON.parse(fs.readFileSync(ingredientsPath, "utf-8"));

  // ── 4. Extract unique brands from serums ──────────────────────
  const uniqueBrandNames = [...new Set(serumsRaw.map((s) => s.brand as string))];
  const brandMap: Record<string, string> = {};

  for (const name of uniqueBrandNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const brand = await prisma.brand.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    brandMap[name] = brand.id;
  }
  console.log(`✅  ${uniqueBrandNames.length} brands created`);

  // ── 5. Seed Serums ────────────────────────────────────────────
  let serumCount = 0;
  for (const s of serumsRaw) {
    const brandId = brandMap[s.brand];
    if (!brandId) { console.warn(`⚠️  Brand not found for serum: ${s.name}`); continue; }

    // Normalize scores — old schema has ingredient/stability/packaging/ux/value
    const scores = {
      total: s.scores?.total ?? 0,
      efficacy: s.scores?.ingredient ?? s.scores?.efficacy ?? 0,
      stability: s.scores?.stability ?? 0,
      formulation: s.scores?.packaging ?? s.scores?.formulation ?? 0,
      value: s.scores?.value ?? 0,
    };

    await prisma.serum.upsert({
      where: { slug: s.slug },
      update: {},
      create: {
        slug: s.slug,
        name: s.name,
        tagline: s.tagline,
        brandId,
        price: s.price,
        volume_ml: s.volume_ml,
        vitamin_c_type: s.vitamin_c_type,
        concentration_percent: s.concentration_percent,
        ph_level: s.ph_level,
        rank: s.rank,
        is_featured: s.is_featured ?? false,
        dermatologist_verdict: s.dermatologist_verdict ?? "",
        scores: JSON.stringify(scores),
        badges: JSON.stringify(s.badges ?? []),
        concerns: JSON.stringify(s.concerns ?? []),
        skin_types: JSON.stringify(s.skin_types ?? []),
        pros: JSON.stringify(s.pros ?? []),
        cons: JSON.stringify(s.cons ?? []),
        key_ingredients: JSON.stringify(s.key_ingredients ?? []),
        buy_links: JSON.stringify(s.buy_links ?? {}),
      },
    });
    serumCount++;
  }
  console.log(`✅  ${serumCount} serums imported`);

  // ── 6. Seed Ingredients ───────────────────────────────────────
  let ingCount = 0;
  for (const i of ingredientsRaw) {
    await prisma.ingredient.upsert({
      where: { slug: i.slug },
      update: {},
      create: {
        slug: i.slug,
        name: i.name,
        alias: i.alias ?? "",
        type: i.type ?? "",
        description: i.description ?? "",
        stability_rating: i.stability_rating ?? 5,
        irritation_risk: i.irritation_risk ?? "Low",
        bioavailability: i.bioavailability ?? 5,
        ph_required: i.ph_required ?? "Any",
        best_for: JSON.stringify(i.best_for ?? []),
        avoid_if: JSON.stringify(i.avoid_if ?? []),
        synergies: JSON.stringify(i.synergies ?? []),
        conflicts: JSON.stringify(i.conflicts ?? []),
      },
    });
    ingCount++;
  }
  console.log(`✅  ${ingCount} ingredients imported`);

  console.log("\n🎉  Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  Admin login:   admin@vitaminc.in / Admin@123");
  console.log("  Creator login: editor@vitaminc.in / Creator@123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => { console.error("❌  Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
