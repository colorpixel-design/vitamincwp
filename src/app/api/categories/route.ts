import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canEditContent, isAdmin } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!canEditContent(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { name, slug, description, color } = await request.json();
  if (!name || !slug) return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
  try {
    const cat = await prisma.category.create({ data: { name, slug, description, color: color || "#1E5FA3" } });
    return NextResponse.json(cat, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
