import { relations } from "drizzle-orm";
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

import { fields } from "./fields";
import { journals } from "./journals";

/**

/**
 * エントリーテーブル
 */
export const entries = sqliteTable("entries", {
  id: text().primaryKey(),
  journalId: text()
    .notNull()
    .references(() => journals.id, { onDelete: "cascade" }),
  bookmark: integer("bookmark", { mode: "boolean" }).notNull().default(false),
  createdAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()),
});

/**
 * エントリー値テーブル
 * エントリーの各フィールドに対する入力値を管理する
 * valueはフィールド種別に応じてJSON文字列で格納する
 */
export const entryValues = sqliteTable(
  "entry_values",
  {
    id: text().primaryKey(),
    entryId: text()
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    fieldId: text()
      .notNull()
      .references(() => fields.id, { onDelete: "cascade" }),
    value: text(),
  },
  (t) => [uniqueIndex("entry_field_unique").on(t.entryId, t.fieldId)], // ユニーク制約
);

export const entriesRelations = relations(entries, ({ one, many }) => ({
  journal: one(journals, {
    fields: [entries.journalId],
    references: [journals.id],
  }),
  values: many(entryValues),
}));

export const entryValuesRelations = relations(entryValues, ({ one }) => ({
  entry: one(entries, {
    fields: [entryValues.entryId],
    references: [entries.id],
  }),
  field: one(fields, {
    fields: [entryValues.fieldId],
    references: [fields.id],
  }),
}));

export type EntryObj = typeof entries.$inferSelect;
