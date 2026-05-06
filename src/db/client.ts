import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "@/db/schemas";

export const expoDb = openDatabaseSync("db.db");

export const db = drizzle(expoDb, { schema });
