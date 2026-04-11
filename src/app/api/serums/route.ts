import { NextRequest, NextResponse } from "next/server";
import { getSerums } from "@/lib/wordpress";

// GET /api/serums — public list with optional filters
// Now powered by WPGraphQL (Headless WordPress)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;
  const featured = searchParams.get("featured") === "true" ? true : undefined;
  const limit = parseInt(searchParams.get("limit") || "100");
  const search = searchParams.get("search") ?? undefined;

  try {
    const serums = await getSerums({ vitaminCType: type, featured, search, limit });
    return NextResponse.json(serums);
  } catch (error: any) {
    console.error("[GET /api/serums] WPGraphQL Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch serums", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}
