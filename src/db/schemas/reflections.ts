import type { z } from "zod";

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

import type { ReflectionCategory } from "@/constants/reflection";

/**
 * AI Reflection テーブル — 1日1件の振り返りを保存
 */
export const reflections = sqliteTable("reflections", {
  id: text().primaryKey(),
  /** 日付 (00:00:00 にリセットした timestamp) */
  date: integer().notNull().unique(),
  /** その日を表す一文 */
  title: text().notNull(),
  /** 1つ目の振り返りカテゴリー */
  firstCategory: text().notNull().$type<ReflectionCategory>(),
  /** 1つ目の振り返り内容 */
  firstContent: text().notNull(),
  /** 2つ目の振り返りカテゴリー */
  secondCategory: text().notNull().$type<ReflectionCategory>(),
  /** 2つ目の振り返り内容 */
  secondContent: text().notNull(),
  createdAt: integer()
    .notNull()
    .$defaultFn(() => Date.now()),
});

export const reflectionSelectSchema = createSelectSchema(reflections);
export type ReflectionObj = z.infer<typeof reflectionSelectSchema>;
