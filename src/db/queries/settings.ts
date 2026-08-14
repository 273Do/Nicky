import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { db } from "@/db/client";
import { settings } from "@/db/schemas";

/**
 * 設定値を取得するライブクエリ
 */
export const useSettingsQuery = () => useLiveQuery(db.select().from(settings));

/**
 * 設定値を書き込む (upsert)
 */
export const setSetting = (key: string, value: string | null) =>
  db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
