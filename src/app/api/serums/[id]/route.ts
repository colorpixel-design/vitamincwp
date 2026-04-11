import { NextRequest, NextResponse } from "next/server";
import { getSerumBySlug, getSerumById } from "@/lib/wordpress";

// GET /api/serums/[id] — by numeric id or slug
// Now powered by WPGraphQL (Headless WordPress)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id);

  try {
    const serum = isNaN(numericId)
      ? await getSerumBySlug(id)
      : await getSerumById(numericId);

    if (!serum) {
      return NextResponse.json({ error: "Serum not found" }, { status: 404 });
    }
    return NextResponse.json(serum);
  } catch (error: any) {
    console.error("[GET /api/serums/[id]] WPGraphQL Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch serum", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

// PUT & DELETE are now handled via WordPress Dashboard + ACF
// These endpoints are intentionally removed in headless mode.
// Content editors use WordPress Admin → Serums to manage data.
