import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canEditContent, isAdmin } from "@/lib/auth";

function parseSerum(s: any) {
  return {
    ...s,
    image: s.image_url || "/placeholder.png",
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

// GET /api/serums/[id] — by numeric id or slug
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = parseInt(id);

  const serum = await prisma.serum.findFirst({
    where: isNaN(numericId) ? { slug: id } : { id: numericId },
    include: { brand: true },
  });

  if (!serum) return NextResponse.json({ error: "Serum not found" }, { status: 404 });
  return NextResponse.json(parseSerum(serum));
}

// PUT /api/serums/[id] — update (content creator+)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canEditContent(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = await request.json();

  // Build update payload — stringify arrays/objects
  const data: any = {};
  const strFields = ["slug", "name", "tagline", "vitamin_c_type", "dermatologist_verdict", "brandId", "image_url"];
  const numFields = ["price", "volume_ml", "concentration_percent", "ph_level", "rank"];
  const jsonFields = ["scores", "badges", "concerns", "skin_types", "pros", "cons", "key_ingredients", "buy_links"];
  const boolFields = ["is_featured"];

  for (const f of strFields) if (body[f] !== undefined) data[f] = body[f];
  for (const f of numFields) if (body[f] !== undefined) data[f] = Number(body[f]);
  for (const f of boolFields) if (body[f] !== undefined) data[f] = Boolean(body[f]);
  for (const f of jsonFields) {
    if (body[f] !== undefined) {
      data[f] = typeof body[f] === "string" ? body[f] : JSON.stringify(body[f]);
    }
  }

  try {
    const serum = await prisma.serum.update({
      where: { id: parseInt(id) },
      data,
      include: { brand: true },
    });
    return NextResponse.json(parseSerum(serum));
  } catch (error: any) {
    if (error.code === "P2025") return NextResponse.json({ error: "Serum not found" }, { status: 404 });
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

// DELETE /api/serums/[id] — admin only
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const { id } = await params;
  try {
    await prisma.serum.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Serum not found" }, { status: 404 });
  }
}
