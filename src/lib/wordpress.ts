/**
 * wordpress.ts — Headless WordPress / WPGraphQL client
 *
 * Data flow:
 *   WordPress (Hostinger) → WPGraphQL plugin → this client → Next.js API routes → frontend
 *
 * Environment variables required:
 *   WP_GRAPHQL_URL   = https://your-wp-site.com/graphql
 *
 * WordPress CPT slugs (must match exactly):
 *   serum, ingredient, brand
 *
 * ACF Field Group slugs (must match exactly):
 *   serum_data, ingredient_data, brand_data
 */

import type {
  WPSerum,
  WPIngredient,
  WPBrand,
  AppSerum,
  AppIngredient,
  AppBrand,
  WPSerumScores,
  WPSerumBuyLinks,
} from "./wp-types";

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL fetcher
// ─────────────────────────────────────────────────────────────────────────────

const WP_GRAPHQL_URL =
  process.env.WP_GRAPHQL_URL || "https://your-wp-site.com/graphql";

async function wpQuery<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    // ISR: revalidate every 5 minutes in production
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(
      `WPGraphQL request failed: ${res.status} ${res.statusText}`
    );
  }

  const json = await res.json();

  if (json.errors?.length) {
    const msg = json.errors.map((e: any) => e.message).join(" | ");
    throw new Error(`WPGraphQL errors: ${msg}`);
  }

  return json.data as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalizers — WP raw → App shape
// ─────────────────────────────────────────────────────────────────────────────

function normalizeSerum(raw: WPSerum): AppSerum {
  const d = raw.serumData ?? {};
  // vitaminCType may come as array from WPGraphQL (checkbox field type)
  const vitaminCType = Array.isArray(d.vitaminCType)
    ? d.vitaminCType[0] ?? ""
    : d.vitaminCType ?? "";

  return {
    id: raw.databaseId,
    slug: raw.slug,
    name: raw.title,
    brand: (raw.serumData?.brand?.nodes?.[0]?.title) ?? raw.serumData?.brand?.title ?? "",
    tagline: d.tagline ?? "",
    image_url:
      (raw as any).featuredImage?.node?.sourceUrl ||
      d.imageUrl ||
      "/placeholder.png",
    price: d.price ?? 0,
    volume_ml: d.volumeMl ?? 0,
    vitamin_c_type: vitaminCType,
    concentration_percent: d.concentrationPercent ?? 0,
    ph_level: d.phLevel ?? 0,
    rank: d.rank ?? 99,
    is_featured: d.isFeatured ?? false,
    dermatologist_verdict: d.dermatologistVerdict ?? "",
    scores: d.scores ?? {
      total: 0,
      efficacy: 0,
      stability: 0,
      formulation: 0,
      value: 0,
    },
    badges: (d.badges ?? []).map((b) => b.badgeName).filter(Boolean),
    concerns: (d.concerns ?? []).map((c) => c.concern).filter(Boolean),
    skin_types: Array.isArray(d.skinTypes) ? d.skinTypes : [],
    pros: (d.pros ?? []).map((p) => p.pro).filter(Boolean),
    cons: (d.cons ?? []).map((c) => c.con).filter(Boolean),
    key_ingredients: (d.keyIngredients ?? [])
      .map((k) => k.ingredientName)
      .filter(Boolean),
    buy_links: d.buyLinks ?? {},
  };
}

function normalizeIngredient(raw: WPIngredient): AppIngredient {
  const d = raw.ingredientData ?? {};
  return {
    id: raw.databaseId,
    slug: raw.slug,
    name: raw.title,
    alias: d.alias ?? "",
    type: d.type ?? "",
    description: d.description ?? "",
    stability_rating: d.stabilityRating ?? 0,
    irritation_risk: d.irritationRisk ?? "Low",
    bioavailability: d.bioavailability ?? 0,
    ph_required: d.phRequired ?? "",
    best_for: (d.bestFor ?? []).map((x) => x.item).filter(Boolean),
    avoid_if: (d.avoidIf ?? []).map((x) => x.item).filter(Boolean),
    synergies: (d.synergies ?? []).map((x) => x.item).filter(Boolean),
    conflicts: (d.conflicts ?? []).map((x) => x.item).filter(Boolean),
  };
}

function normalizeBrand(raw: WPBrand): AppBrand {
  return {
    id: raw.databaseId,
    slug: raw.slug,
    name: raw.title,
    website: raw.brandData?.website ?? undefined,
    logo: raw.brandData?.logo?.sourceUrl ?? undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// GraphQL fragments
// ─────────────────────────────────────────────────────────────────────────────

const SERUM_FIELDS = /* GraphQL */ `
  id
  databaseId
  title
  slug
  date
  modified
  featuredImage {
    node {
      sourceUrl
      altText
    }
  }
  serumData {
    tagline
    imageUrl
    price
    volumeMl
    vitaminCType
    concentrationPercent
    phLevel
    rank
    isFeatured
    dermatologistVerdict
    brand {
      nodes {
        ... on Brand {
          databaseId
          title
          slug
        }
      }
    }
    scores {
      total
      efficacy
      stability
      formulation
      value
    }
    badges {
      badgeName
    }
    concerns {
      concern
    }
    skinTypes
    pros {
      pro
    }
    cons {
      con
    }
    keyIngredients {
      ingredientName
    }
    buyLinks {
      amazon
      flipkart
      nykaa
      myntra
      purplle
    }
  }
`;

const INGREDIENT_FIELDS = /* GraphQL */ `
  id
  databaseId
  title
  slug
  date
  modified
  ingredientData {
    alias
    type
    description
    stabilityRating
    irritationRisk
    bioavailability
    phRequired
    bestFor { item }
    avoidIf { item }
    synergies { item }
    conflicts { item }
  }
`;

const BRAND_FIELDS = /* GraphQL */ `
  id
  databaseId
  title
  slug
  brandData {
    website
    logo { sourceUrl }
  }
`;

// ─────────────────────────────────────────────────────────────────────────────
// Serum queries
// ─────────────────────────────────────────────────────────────────────────────

export async function getSerums(filters?: {
  vitaminCType?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}): Promise<AppSerum[]> {
  const limit = filters?.limit ?? 100;

  // Build a "where" clause for WPGraphQL filtering
  // WPGraphQL supports metaQuery through WPGraphQL Smart Cache or custom
  // For now we fetch all and filter in-memory (works fine for <200 items)
  const query = /* GraphQL */ `
    query GetSerums($first: Int!) {
      serums(first: $first, where: { orderby: { field: DATE, order: ASC } }) {
        nodes {
          ${SERUM_FIELDS}
        }
      }
    }
  `;

  const data = await wpQuery<{ serums: { nodes: WPSerum[] } }>(query, {
    first: limit,
  });

  let results = data.serums.nodes.map(normalizeSerum);

  // Client-side filtering (simpler, works for small datasets)
  if (filters?.vitaminCType) {
    results = results.filter(
      (s) => s.vitamin_c_type === filters.vitaminCType
    );
  }
  if (filters?.featured) {
    results = results.filter((s) => s.is_featured);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.brand.toLowerCase().includes(q)
    );
  }

  // Sort by rank
  return results.sort((a, b) => a.rank - b.rank);
}

export async function getSerumBySlug(slug: string): Promise<AppSerum | null> {
  const query = /* GraphQL */ `
    query GetSerumBySlug($slug: ID!) {
      serum(id: $slug, idType: SLUG) {
        ${SERUM_FIELDS}
      }
    }
  `;

  try {
    const data = await wpQuery<{ serum: WPSerum | null }>(query, { slug });
    if (!data.serum) return null;
    return normalizeSerum(data.serum);
  } catch {
    return null;
  }
}

export async function getSerumById(id: number): Promise<AppSerum | null> {
  const query = /* GraphQL */ `
    query GetSerumById($id: ID!) {
      serum(id: $id, idType: DATABASE_ID) {
        ${SERUM_FIELDS}
      }
    }
  `;

  try {
    const data = await wpQuery<{ serum: WPSerum | null }>(query, {
      id: id.toString(),
    });
    if (!data.serum) return null;
    return normalizeSerum(data.serum);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Ingredient queries
// ─────────────────────────────────────────────────────────────────────────────

export async function getIngredients(): Promise<AppIngredient[]> {
  const query = /* GraphQL */ `
    query GetIngredients {
      ingredients(first: 500, where: { orderby: { field: TITLE, order: ASC } }) {
        nodes {
          ${INGREDIENT_FIELDS}
        }
      }
    }
  `;

  const data = await wpQuery<{ ingredients: { nodes: WPIngredient[] } }>(query);
  return data.ingredients.nodes.map(normalizeIngredient);
}

export async function getIngredientBySlugOrId(
  idOrSlug: string
): Promise<AppIngredient | null> {
  const numericId = parseInt(idOrSlug);
  const isNumeric = !isNaN(numericId);

  const query = /* GraphQL */ `
    query GetIngredient($id: ID!, $idType: IngredientIdType!) {
      ingredient(id: $id, idType: $idType) {
        ${INGREDIENT_FIELDS}
      }
    }
  `;

  try {
    const data = await wpQuery<{ ingredient: WPIngredient | null }>(query, {
      id: isNumeric ? numericId.toString() : idOrSlug,
      idType: isNumeric ? "DATABASE_ID" : "SLUG",
    });
    if (!data.ingredient) return null;
    return normalizeIngredient(data.ingredient);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand queries
// ─────────────────────────────────────────────────────────────────────────────

export async function getBrands(): Promise<AppBrand[]> {
  const query = /* GraphQL */ `
    query GetBrands {
      brands(first: 200, where: { orderby: { field: TITLE, order: ASC } }) {
        nodes {
          ${BRAND_FIELDS}
        }
      }
    }
  `;

  const data = await wpQuery<{ brands: { nodes: WPBrand[] } }>(query);
  return data.brands.nodes.map(normalizeBrand);
}
