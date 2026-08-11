import type { SFSymbol } from "expo-symbols";

import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { entries } from "./entries";
import { fields } from "./fields";

/**
 * ジャーナルテーブル
 */
export const journals = sqliteTable("journals", {
  id: text().primaryKey(),
  name: text().notNull(),
  /** SFSymbol名 */
  icon: text().notNull().$type<SFSymbol>(),
  /** HEXカラーコード */
  color: text().notNull(),
  createdAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()),
  updatedAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const journalsRelations = relations(journals, ({ many }) => ({
  fields: many(fields),
  entries: many(entries),
}));

const sfSymbolSchema = z.string() as z.ZodType<SFSymbol>;
export const journalSelectSchema = createSelectSchema(journals, { icon: sfSymbolSchema });
export const journalInsertSchema = createInsertSchema(journals, { icon: sfSymbolSchema });
export type JournalObj = z.infer<typeof journalSelectSchema>;
