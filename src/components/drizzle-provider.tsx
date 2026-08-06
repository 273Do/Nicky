import type { ReactNode } from "react";

import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

import { db, expoDb } from "@/db/client";
import { seed } from "@/db/seed";

import migrations from "../../drizzle/migrations";

type Props = {
  /**
   * React Node
   */
  children: ReactNode;
};

/**
 * ローカルDBプロバイダー
 */
export function DrizzleProvider({ children }: Props) {
  const { success, error: migrateError } = useMigrations(db, migrations);

  useDrizzleStudio(expoDb); // Drizzle Studio の設定（開発環境でのみ有効）

  if (migrateError) {
    console.error("Migration Error:", migrateError);
    throw migrateError;
  }

  if (!success) return null;

  if (__DEV__) seed();

  return <>{children}</>;
}
