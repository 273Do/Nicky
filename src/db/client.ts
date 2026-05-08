import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "@/db/schemas";

export const expoDb = openDatabaseSync("db.db", { enableChangeListener: true });

// 外部キー制約を有効化
expoDb.execSync("PRAGMA foreign_keys = ON");

export const db = drizzle(expoDb, { schema });
