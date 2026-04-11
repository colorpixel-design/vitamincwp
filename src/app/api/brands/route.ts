import { NextResponse } from "next/server";
import { getBrands } from "@/lib/wordpress";

// GET /api/brands — full brand list
// Now powered by WPGraphQL (Headless WordPress)
export async function GET() {
  try {
    const brands = await getBrands();
    return NextResponse.json(brands);
  } catch (error: any) {
    console.error("[GET /api/brands] WPGraphQL Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch brands", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

// POST is now handled via WordPress Dashboard → Brands CPT
