import { z } from "zod";

import type { FieldType } from "@/constants/journal";

export const fieldValueSchema = z.union([z.string(), z.number(), z.boolean(), z.date(), z.null()]);
export type FieldValue = z.infer<typeof fieldValueSchema>;

/** フィールドタイプごとの値バリデーションスキーマ */
const fieldValueSchemaByType: Record<FieldType, z.ZodType<FieldValue>> = {
  text: z.string().max(40),
  longText: z.string(),
  link: z.string(),
  number: z.number(),
  rating: z.number().min(0).max(5),
  check: z.boolean(),
  date: z.date(),
  time: z.date(),
  media: z.null(),
  audio: z.null(),
  location: z.string(),
};

/**
 * フィールドタイプに応じた値のバリデーション
 * @param value フィールドの値
 * @param type フィールドタイプ
 */
export const validateFieldValue = (value: FieldValue, type: FieldType): void => {
  fieldValueSchemaByType[type].parse(value);
};

/**
 * 各エントリー入力のデフォルト値
 * @param type フィールドタイプ
 */
export const getDefaultValue = (type: FieldType): FieldValue => {
  switch (type) {
    case "text":
    case "longText":
      return "";
    case "check":
      return false;
    case "date":
    case "time":
      return new Date();
    default:
      return null;
  }
};

/** FieldValue を DB の text 型に変換 */
export const serializeValue = (value: FieldValue): string | null => {
  if (value === null) return null;
  if (value instanceof Date) return String(value.getTime());
  return String(value);
};

/**
 * DB の text 型を FieldValue に変換
 * @param value DB の値
 * @param type フィールドタイプ
 */
export const deserializeValue = (value: string | null, type: FieldType): FieldValue => {
  if (value === null) return getDefaultValue(type);
  switch (type) {
    case "number":
      return Number(value);
    case "check":
      return value === "true";
    case "date":
    case "time":
      return new Date(Number(value));
    case "media":
      return null;
    case "location":
      return value;
    default:
      return value;
  }
};
