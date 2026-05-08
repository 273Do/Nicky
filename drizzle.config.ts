import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  driver: "expo",
  schema: "./src/db/schemas",
  out: "./drizzle",
} satisfies Config;
