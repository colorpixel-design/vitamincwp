import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // PostgreSQL for all environments
    // Local: docker-compose PostgreSQL
    // Production: AWS RDS PostgreSQL
    url: process.env["DATABASE_URL"] ?? "postgresql://vitaminc:vitaminc_local_pass@localhost:5432/vitaminc_db",
  },
});
