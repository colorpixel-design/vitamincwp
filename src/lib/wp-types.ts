// ─────────────────────────────────────────────────────────────────────────────
// WordPress / ACF PRO → WPGraphQL TypeScript Types
//
// ACF Field Group slugs (IMPORTANT — must match exactly in WordPress):
//   Serum CPT      → field group slug: "serum_data"
//   Ingredient CPT → field group slug: "ingredient_data"
//   Brand CPT      → field group slug: "brand_data"
// ─────────────────────────────────────────────────────────────────────────────

// ── Raw WPGraphQL response shapes ────────────────────────────────────────────

export interface WPPageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface WPNode {
  id: string;        // WP global ID (base64)
  databaseId: number; // WP post numeric ID
  title: string;
  slug: string;
  date: string;
  modified: string;
}

// ── Brand ─────────────────────────────────────────────────────────────────────

export interface WPBrandACF {
  website?: string;
  logo?: { sourceUrl: string } | null;
}

export interface WPBrand extends WPNode {
  brandData?: WPBrandACF;
}

// ── Scores (ACF Group inside Serum) ──────────────────────────────────────────

export interface WPSerumScores {
  total: number;
  efficacy: number;
  stability: number;
  formulation: number;
  value: number;
  [key: string]: number; // index signature for SerumCard compatibility
}

// ── Buy Links (ACF Group inside Serum) ───────────────────────────────────────

export interface WPSerumBuyLinks {
  amazon?: string;
  flipkart?: string;
  nykaa?: string;
  myntra?: string;
  purplle?: string;
}

// ACF Post Object field returns a connection shape in WPGraphQL
export interface WPBrandConnection {
  nodes?: WPBrand[];
  // scalar fallback for direct title access
  title?: string;
}

// ── Serum ACF fields ─────────────────────────────────────────────────────────

export interface WPSerumACF {
  tagline?: string;
  brand?: WPBrandConnection | null;  // Post Object → connection with nodes[]
  imageUrl?: string;               // Image field → sourceUrl
  price?: number;
  volumeMl?: number;
  vitaminCType?: string;
  concentrationPercent?: number;
  phLevel?: number;
  rank?: number;
  isFeatured?: boolean;
  dermatologistVerdict?: string;
  scores?: WPSerumScores;
  badges?: Array<{ badgeName: string }>;        // Repeater
  concerns?: Array<{ concern: string }>;        // Repeater
  skinTypes?: string[];                         // Checkbox (returns array)
  pros?: Array<{ pro: string }>;                // Repeater
  cons?: Array<{ con: string }>;                // Repeater
  keyIngredients?: Array<{ ingredientName: string }>; // Repeater
  buyLinks?: WPSerumBuyLinks;
}

export interface WPSerum extends WPNode {
  serumData?: WPSerumACF;
}

export interface WPSerumsResponse {
  serums: {
    pageInfo: WPPageInfo;
    nodes: WPSerum[];
  };
}

export interface WPSerumResponse {
  serum: WPSerum | null;
}

// ── Ingredient ACF fields ─────────────────────────────────────────────────────

export interface WPIngredientACF {
  alias?: string;
  type?: string;
  description?: string;
  stabilityRating?: number;
  irritationRisk?: string;
  bioavailability?: number;
  phRequired?: string;
  bestFor?: Array<{ item: string }>;    // Repeater
  avoidIf?: Array<{ item: string }>;   // Repeater
  synergies?: Array<{ item: string }>; // Repeater
  conflicts?: Array<{ item: string }>; // Repeater
}

export interface WPIngredient extends WPNode {
  ingredientData?: WPIngredientACF;
}

export interface WPIngredientsResponse {
  ingredients: {
    pageInfo: WPPageInfo;
    nodes: WPIngredient[];
  };
}

// ── Normalised app-level types (what pages/components receive) ────────────────
// These mirror the old Prisma-based shapes so the frontend changes minimally.

export interface AppSerum {
  id: number;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  image_url: string;
  price: number;
  volume_ml: number;
  vitamin_c_type: string;
  concentration_percent: number;
  ph_level: number;
  rank: number;
  is_featured: boolean;
  dermatologist_verdict: string;
  scores: WPSerumScores;
  badges: string[];
  concerns: string[];
  skin_types: string[];
  pros: string[];
  cons: string[];
  key_ingredients: string[];
  buy_links: WPSerumBuyLinks;
}

export interface AppIngredient {
  id: number;
  slug: string;
  name: string;
  alias: string;
  type: string;
  description: string;
  stability_rating: number;
  irritation_risk: string;
  bioavailability: number;
  ph_required: string;
  best_for: string[];
  avoid_if: string[];
  synergies: string[];
  conflicts: string[];
}

export interface AppBrand {
  id: number;
  slug: string;
  name: string;
  website?: string;
  logo?: string;
}

export interface AppCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  color: string;
}
