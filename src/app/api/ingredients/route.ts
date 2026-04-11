import { NextResponse } from "next/server";
import { getIngredients } from "@/lib/wordpress";

// GET /api/ingredients — full ingredient list
// Now powered by WPGraphQL (Headless WordPress)
export async function GET() {
  try {
    const ingredients = await getIngredients();
    return NextResponse.json(ingredients);
  } catch (error: any) {
    console.error("[GET /api/ingredients] WPGraphQL Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

// POST is now handled via WordPress Dashboard → Ingredients CPT
