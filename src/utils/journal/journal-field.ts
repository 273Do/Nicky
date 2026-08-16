import { z } from "zod";

import { fieldTypeSchema, type FieldType, journalIconSchema } from "@/constants/journal";
import { fieldInsertSchema } from "@/db/schemas";

import { hexColorSchema } from "./color";

/**
 * ジャーナルメタ情報のスキーマ
 */
export const journalMetaSchema = z.object({
  name: z.string().trim().min(1).max(20), // 20文字まで
  color: hexColorSchema,
  icon: journalIconSchema,
});
export type JournalMetaObj = z.infer<typeof journalMetaSchema>;

/**
 * ジャーナル作成フォームのフィールド下書き（journalId・sortOrder なし）
 */
export const fieldDraftSchema = fieldInsertSchema
  .omit({ journalId: true, sortOrder: true })
  .extend({ label: z.string().trim().min(1).max(30) }); // 30 文字まで
export type FieldDraftObj = z.infer<typeof fieldDraftSchema>;

/**
 * sortOrder 確定済み・journalId 未割当のフィールド（DB 保存直前）
 */
export const fieldWithSortSchema = fieldInsertSchema.omit({ journalId: true });
export type FieldWithSortObj = z.infer<typeof fieldWithSortSchema>;

/**
 * 全 FieldType の配列
 */
export const FIELD_TYPES: FieldType[] = fieldTypeSchema.options;
