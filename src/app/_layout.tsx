import React from "react";

import { drizzle } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";

import AppTabs from "@/components/app-tabs";

import migrations from "../../drizzle/migrations";

export * from "@/db/schemas/entries";
export * from "@/db/schemas/fields";
export * from "@/db/schemas/journals";

export default function RootLayout() {
  const expo = SQLite.openDatabaseSync("db.db");
  const db = drizzle(expo);
  const { success, error } = useMigrations(db, migrations);

  console.log(error);

  if (!success) return null;
  return <AppTabs />;
}
