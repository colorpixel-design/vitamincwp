import { NextRequest, NextResponse } from "next/server";
import { getIngredientBySlugOrId } from "@/lib/wordpress";

// GET /api/ingredients/[id] — by numeric id or slug
// Now powered by WPGraphQL (Headless WordPress)
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const ingredient = await getIngredientBySlugOrId(id);
    if (!ingredient) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(ingredient);
  } catch (error: any) {
    console.error("[GET /api/ingredients/[id]] WPGraphQL Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredient", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

// PUT & DELETE are now handled via WordPress Dashboard → Ingredients CPT
