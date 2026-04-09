/**
 * Prisma Client — PostgreSQL
 *
 * Prisma 7 requires a driver adapter (no longer supports raw PrismaClient()).
 * We use @prisma/adapter-pg which wraps node-postgres Pool.
 *
 * Local dev:   Neon.tech free PostgreSQL (DATABASE_URL in .env)
 * Production:  AWS RDS PostgreSQL (DATABASE_URL in GitHub Secrets → EC2 .env)
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

type PrismaClientType = typeof PrismaClient.prototype;

function createPrismaClient(): PrismaClientType {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://vitaminc:vitaminc_local_pass@localhost:5432/vitaminc_db";

  const pool = new Pool({
    connectionString,
    max: 5,                      // max connections (safe for t2.micro + Neon free)
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    ssl: connectionString.includes("neon.tech") || connectionString.includes("rds.amazonaws.com")
      ? { rejectUnauthorized: false }  // SSL required for Neon + RDS
      : undefined,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClientType };

export const prisma: PrismaClientType =
  globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
