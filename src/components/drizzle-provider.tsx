import type { ReactNode } from "react";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseSync } from "expo-sqlite";

import * as schema from "@/db/schemas";

import migrations from "../../drizzle/migrations";

const expoDb = openDatabaseSync("db.db");

export const db = drizzle(expoDb, { schema });

type Props = {
  children: ReactNode;
};

export function DrizzleProvider({ children }: Props) {
  const { success, error: migrateError } = useMigrations(db, migrations);

  if (migrateError) {
    console.error("Migration Error:", migrateError);
    throw migrateError;
  }

  if (!success) return null;

  return <>{children}</>;
}
