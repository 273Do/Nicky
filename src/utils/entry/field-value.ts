import { z } from "zod";

import type { FieldType } from "@/constants/journal";

export const fieldValueSchema = z.union([z.string(), z.number(), z.boolean(), z.date(), z.null()]);
export type FieldValue = z.infer<typeof fieldValueSchema>;

/** フィールドタイプごとの値バリデーションスキーマ */
const fieldValueSchemaByType: Record<FieldType, z.ZodType<FieldValue>> = {
  text: z.string().max(40),
  longText: z.string(),
  link: z.union([z.url(), z.literal(""), z.null()]),
  number: z.number(),
  media: z.null(),
  audio: z.null(),
  date: z.date(),
  time: z.date(),
  check: z.boolean(),
  rating: z.number().min(0).max(5),
  location: z.string().nullable(),
};

/** 位置情報のスキーマ */
export const locationDataSchema = z.object({
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});

/** 位置情報の JSON 構造 */
export type LocationData = z.infer<typeof locationDataSchema>;

/** JSON 文字列をパースして LocationData を返す */
export const parseLocation = (value: string | undefined): LocationData | null => {
  if (!value) return null;

  try {
    return locationDataSchema.parse(JSON.parse(value));
  } catch {
    return null;
  }
};

/**
 * フィールドタイプに応じた値のバリデーション
 * @param value フィールドの値
 * @param type フィールドタイプ
 */
export const validateFieldValue = (value: FieldValue, type: FieldType): void => {
  fieldValueSchemaByType[type].parse(value);

  if (type === "location" && typeof value === "string" && value) {
    locationDataSchema.parse(JSON.parse(value));
  }
};

/**
 * 各エントリー入力のデフォルト値
 * @param type フィールドタイプ
 */
export const getDefaultValue = (type: FieldType): FieldValue => {
  switch (type) {
    case "text":
    case "longText":
    case "link":
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
