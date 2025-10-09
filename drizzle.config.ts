import type { Config } from "drizzle-kit";

export default {
  dialect: "postgresql",
  schema: "./src/lib/server/db/schema.ts",
  out: "./drizzle",
  casing: "snake_case",
} satisfies Config;