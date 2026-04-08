/**
 * Prisma Client — PostgreSQL via @prisma/adapter-pg
 *
 * Prisma 7 requires a driver adapter. We use the official
 * @prisma/adapter-pg which wraps the node-postgres (pg) Pool.
 *
 * Local:      Docker PostgreSQL (docker-compose up -d)
 * Production: AWS RDS PostgreSQL (private subnet)
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
    // Connection pool settings — optimal for t2.micro (1 vCPU, 1GB RAM)
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
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
