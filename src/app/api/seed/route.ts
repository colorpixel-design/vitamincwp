import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import serumsData from "@/data/serums.json";
import ingredientsData from "@/data/ingredients.json";

// Safety: only allow in development
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seed not allowed in production" }, { status: 403 });
  }

  try {
    // Admin user
    const adminPwd = await bcrypt.hash("Admin@123", 12);
    await prisma.user.upsert({
      where: { email: "admin@vitaminc.in" },
      update: {},
      create: { name: "Admin", email: "admin@vitaminc.in", password: adminPwd, role: "MASTER_ADMIN" },
    });

    // Content Creator
    const creatorPwd = await bcrypt.hash("Creator@123", 12);
    await prisma.user.upsert({
      where: { email: "editor@vitaminc.in" },
      update: {},
      create: { name: "Content Editor", email: "editor@vitaminc.in", password: creatorPwd, role: "CONTENT_CREATOR" },
    });

    // Categories
    const cats = [
      { name: "Brightening", slug: "brightening", color: "#F59E0B" },
      { name: "Hyperpigmentation", slug: "hyperpigmentation", color: "#8B5CF6" },
      { name: "Anti-Aging", slug: "anti-aging", color: "#1E5FA3" },
      { name: "Acne", slug: "acne", color: "#10B981" },
      { name: "Hydration", slug: "hydration", color: "#06B6D4" },
    ];
    for (const c of cats) {
      await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
    }

    // Brands from serums
    const brandNames = [...new Set((serumsData as any[]).map((s) => s.brand as string))];
    const brandMap: Record<string, string> = {};
    for (const name of brandNames) {
      const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const b = await prisma.brand.upsert({ where: { slug }, update: {}, create: { name, slug } });
      brandMap[name] = b.id;
    }

    // Serums
    let serumCount = 0;
    for (const s of serumsData as any[]) {
      const brandId = brandMap[s.brand];
      if (!brandId) continue;
      const scores = {
        total: s.scores?.total ?? 0, efficacy: s.scores?.ingredient ?? 0,
        stability: s.scores?.stability ?? 0, formulation: s.scores?.packaging ?? 0,
        value: s.scores?.value ?? 0,
      };
      await prisma.serum.upsert({
        where: { slug: s.slug }, update: {},
        create: {
          slug: s.slug, name: s.name, tagline: s.tagline, brandId,
          price: s.price, volume_ml: s.volume_ml, vitamin_c_type: s.vitamin_c_type,
          concentration_percent: s.concentration_percent, ph_level: s.ph_level,
          rank: s.rank, is_featured: s.is_featured ?? false,
          dermatologist_verdict: s.dermatologist_verdict ?? "",
          scores: JSON.stringify(scores), badges: JSON.stringify(s.badges ?? []),
          concerns: JSON.stringify(s.concerns ?? []), skin_types: JSON.stringify(s.skin_types ?? []),
          pros: JSON.stringify(s.pros ?? []), cons: JSON.stringify(s.cons ?? []),
          key_ingredients: JSON.stringify(s.key_ingredients ?? []),
          buy_links: JSON.stringify(s.buy_links ?? {}),
        },
      });
      serumCount++;
    }

    // Ingredients
    let ingCount = 0;
    for (const i of ingredientsData as any[]) {
      await prisma.ingredient.upsert({
        where: { slug: i.slug }, update: {},
        create: {
          slug: i.slug, name: i.name, alias: i.alias ?? "", type: i.type ?? "",
          description: i.description ?? "", stability_rating: i.stability_rating ?? 5,
          irritation_risk: i.irritation_risk ?? "Low", bioavailability: i.bioavailability ?? 5,
          ph_required: i.ph_required ?? "Any",
          best_for: JSON.stringify(i.best_for ?? []), avoid_if: JSON.stringify(i.avoid_if ?? []),
          synergies: JSON.stringify(i.synergies ?? []), conflicts: JSON.stringify(i.conflicts ?? []),
        },
      });
      ingCount++;
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      data: { users: 2, categories: cats.length, brands: brandNames.length, serums: serumCount, ingredients: ingCount },
    });
  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  // Show current counts
  const [users, serums, ingredients, brands, categories] = await Promise.all([
    prisma.user.count(), prisma.serum.count(), prisma.ingredient.count(),
    prisma.brand.count(), prisma.category.count(),
  ]);
  return NextResponse.json({ users, serums, ingredients, brands, categories });
}
