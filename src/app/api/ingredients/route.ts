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

export async function GET() {
  const ingredients = await prisma.ingredient.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(ingredients.map(parseIng));
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!canEditContent(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await request.json();
  try {
    const ing = await prisma.ingredient.create({
      data: {
        slug: body.slug,
        name: body.name,
        alias: body.alias || "",
        type: body.type || "",
        description: body.description || "",
        stability_rating: Number(body.stability_rating || 5),
        irritation_risk: body.irritation_risk || "Low",
        bioavailability: Number(body.bioavailability || 5),
        ph_required: body.ph_required || "Any",
        best_for: JSON.stringify(body.best_for || []),
        avoid_if: JSON.stringify(body.avoid_if || []),
        synergies: JSON.stringify(body.synergies || []),
        conflicts: JSON.stringify(body.conflicts || []),
      },
    });
    return NextResponse.json(parseIng(ing), { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
