import { defineConfig } from "prisma/config";
import "dotenv/config";

// Prisma 7: Connection URL lives here, NOT in schema.prisma
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env["DATABASE_URL"] ??
      "postgresql://vitaminc:vitaminc_local_pass@localhost:5432/vitaminc_db",
  },
});
