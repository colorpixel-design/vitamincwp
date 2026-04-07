import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, canEditContent, isAdmin } from "@/lib/auth";

export async function GET() {
  const brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(brands);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!canEditContent(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  const { name, slug, website, logo } = await request.json();
  if (!name || !slug) return NextResponse.json({ error: "Name and slug required" }, { status: 400 });
  try {
    const brand = await prisma.brand.create({ data: { name, slug, website, logo } });
    return NextResponse.json(brand, { status: 201 });
  } catch (e: any) {
    if (e.code === "P2002") return NextResponse.json({ error: "Brand already exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
