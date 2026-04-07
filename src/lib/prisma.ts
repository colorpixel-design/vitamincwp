// @ts-expect-error - Prisma 7 generates PrismaClient in .prisma/client, re-exported from @prisma/client at runtime
import { PrismaClient } from "@prisma/client";

type PrismaClientType = typeof PrismaClient.prototype;

function createPrismaClient(): PrismaClientType {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientType };

export const prisma: PrismaClientType =
  globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
