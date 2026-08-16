import { sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * アプリ設定テーブル (KVS形式)
 */
export const settings = sqliteTable("settings", {
  key: text().primaryKey(),
  value: text(),
});
