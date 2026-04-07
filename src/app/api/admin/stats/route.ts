import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, isAdmin } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!isAdmin(user)) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const [totalSerums, totalIngredients, totalBrands, totalCategories, totalUsers,
    adminCount, creatorCount, visitorCount] = await Promise.all([
    prisma.serum.count(),
    prisma.ingredient.count(),
    prisma.brand.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: "MASTER_ADMIN" } }),
    prisma.user.count({ where: { role: "CONTENT_CREATOR" } }),
    prisma.user.count({ where: { role: "VISITOR" } }),
  ]);

  const recentSerums = await prisma.serum.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { brand: true },
    select: { id: true, name: true, brand: { select: { name: true } }, createdAt: true },
  });

  return NextResponse.json({
    content: { serums: totalSerums, ingredients: totalIngredients, brands: totalBrands, categories: totalCategories },
    users: { total: totalUsers, admin: adminCount, creator: creatorCount, visitor: visitorCount },
    recentSerums,
  });
}
