import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canEditContent } from "@/lib/auth";

// Helper to parse a serum row — expand JSON strings back to objects/arrays
function parseSerum(s: any) {
  return {
    ...s,
    scores: JSON.parse(s.scores || "{}"),
    badges: JSON.parse(s.badges || "[]"),
    concerns: JSON.parse(s.concerns || "[]"),
    skin_types: JSON.parse(s.skin_types || "[]"),
    pros: JSON.parse(s.pros || "[]"),
    cons: JSON.parse(s.cons || "[]"),
    key_ingredients: JSON.parse(s.key_ingredients || "[]"),
    buy_links: JSON.parse(s.buy_links || "{}"),
    brand: s.brand?.name ?? "",
  };
}

// GET /api/serums — public list with optional filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") || "100");
  const search = searchParams.get("search");

  const where: any = {};
  if (type) where.vitamin_c_type = type;
  if (featured === "true") where.is_featured = true;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { tagline: { contains: search } },
    ];
  }

  const serums = await prisma.serum.findMany({
    where,
    include: { brand: true },
    orderBy: { rank: "asc" },
    take: limit,
  });

  return NextResponse.json(serums.map(parseSerum));
}

// POST /api/serums — create (content creator+)
export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!canEditContent(user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validate required fields
    const required = ["slug", "name", "brandId", "vitamin_c_type", "price", "volume_ml", "tagline", "dermatologist_verdict"];
    for (const f of required) {
      if (!body[f]) return NextResponse.json({ error: `${f} is required` }, { status: 400 });
    }

    const serum = await prisma.serum.create({
      data: {
        slug: body.slug,
        name: body.name,
        tagline: body.tagline,
        brandId: body.brandId,
        price: Number(body.price),
        volume_ml: Number(body.volume_ml),
        vitamin_c_type: body.vitamin_c_type,
        concentration_percent: Number(body.concentration_percent || 10),
        ph_level: Number(body.ph_level || 3.5),
        rank: Number(body.rank || 99),
        is_featured: Boolean(body.is_featured),
        dermatologist_verdict: body.dermatologist_verdict,
        scores: JSON.stringify(body.scores || { total: 0, efficacy: 0, stability: 0, formulation: 0, value: 0 }),
        badges: JSON.stringify(body.badges || []),
        concerns: JSON.stringify(body.concerns || []),
        skin_types: JSON.stringify(body.skin_types || []),
        pros: JSON.stringify(body.pros || []),
        cons: JSON.stringify(body.cons || []),
        key_ingredients: JSON.stringify(body.key_ingredients || []),
        buy_links: JSON.stringify(body.buy_links || {}),
      },
      include: { brand: true },
    });

    return NextResponse.json(parseSerum(serum), { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A serum with this slug already exists" }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create serum" }, { status: 500 });
  }
}
