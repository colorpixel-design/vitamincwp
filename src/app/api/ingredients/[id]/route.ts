import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canEditContent, isAdmin } from "@/lib/auth";

function parseIng(i: any) {
  return {
    ...i,
    best_for: JSON.parse(i.best_for || "[]"),
    avoid_if: JSON.parse(i.avoid_if || "[]"),
    synergies: JSON.parse(i.synergies || "[]"),
    conflicts: JSON.parse(i.conflicts || "[]"),
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);
  const ing = await prisma.ingredient.findFirst({
    where: isNaN(numId) ? { slug: id } : { id: numId },
  });
  if (!ing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(parseIng(ing));
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!canEditContent(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  const body = await request.json();
  const data: any = {};
  const strFields = ["slug", "name", "alias", "type", "description", "irritation_risk", "ph_required"];
  const numFields = ["stability_rating", "bioavailability"];
  const jsonFields = ["best_for", "avoid_if", "synergies", "conflicts"];
  for (const f of strFields) if (body[f] !== undefined) data[f] = body[f];
  for (const f of numFields) if (body[f] !== undefined) data[f] = Number(body[f]);
  for (const f of jsonFields) if (body[f] !== undefined) data[f] = typeof body[f] === "string" ? body[f] : JSON.stringify(body[f]);
  try {
    const ing = await prisma.ingredient.update({ where: { id: parseInt(id) }, data });
    return NextResponse.json(parseIng(ing));
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { id } = await params;
  try {
    await prisma.ingredient.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
