import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import type { FieldType } from "@/core/constants";

import { entryValues } from "./entries";
import { journals } from "./journals";

/**
 * フィールド定義テーブル
 */
export const fields = sqliteTable("fields", {
  id: text().primaryKey(),
  journalId: text()
    .notNull()
    .references(() => journals.id, { onDelete: "cascade" }),
  /** フィールドの種別 */
  type: text().notNull().$type<FieldType>(),
  label: text().notNull(),
  /** 表示順 */
  sortOrder: integer().notNull(),
});

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  journal: one(journals, {
    fields: [fields.journalId],
    references: [journals.id],
  }),
  entryValues: many(entryValues),
}));

export type FieldlObj = typeof fields.$inferInsert;
