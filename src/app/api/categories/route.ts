import { NextResponse } from "next/server";

// GET /api/categories
// In the Headless WordPress setup, categories are managed as
// WordPress Custom Taxonomies (registered on the `serum` CPT).
//
// For now this returns a static list of Vitamin C serum categories.
// In future: fetch from WPGraphQL → serumCategories taxonomy.
export async function GET() {
  const categories = [
    { id: "l-ascorbic-acid", slug: "l-ascorbic-acid", name: "L-Ascorbic Acid", description: "The gold standard form of Vitamin C", color: "#1E5FA3" },
    { id: "ascorbyl-glucoside", slug: "ascorbyl-glucoside", name: "Ascorbyl Glucoside", description: "Stable, gentle derivative", color: "#059669" },
    { id: "sodium-ascorbyl-phosphate", slug: "sodium-ascorbyl-phosphate", name: "Sodium Ascorbyl Phosphate", description: "Excellent for acne-prone skin", color: "#7C3AED" },
    { id: "ascorbyl-tetraisopalmitate", slug: "ascorbyl-tetraisopalmitate", name: "Ascorbyl Tetraisopalmitate", description: "Oil-soluble, fast penetration", color: "#D97706" },
    { id: "magnesium-ascorbyl-phosphate", slug: "magnesium-ascorbyl-phosphate", name: "Magnesium Ascorbyl Phosphate", description: "Great for sensitive skin", color: "#DC2626" },
    { id: "ethyl-ascorbic-acid", slug: "ethyl-ascorbic-acid", name: "Ethyl Ascorbic Acid", description: "Highly stable, good bioavailability", color: "#0891B2" },
  ];
  return NextResponse.json(categories);
}
