import { z } from "zod";

import type { FieldType } from "@/constants/journal";
import { RATING_DEFAULT_MAX, RATING_DEFAULT_MIN, TEXT_FIELD_MAX } from "@/constants/validation";

export const fieldValueSchema = z.union([z.string(), z.number(), z.boolean(), z.date(), z.null()]);
export type FieldValue = z.infer<typeof fieldValueSchema>;

/** フィールドタイプごとの値バリデーションスキーマ */
const fieldValueSchemaByType: Record<FieldType, z.ZodType<FieldValue>> = {
  text: z.string().max(TEXT_FIELD_MAX),
  longText: z.string(),
  link: z.union([z.url(), z.literal(""), z.null()]),
  number: z.number(),
  media: z.string().nullable(),
  date: z.date(),
  time: z.date(),
  check: z.boolean(),
  rating: z.number(),
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

/** レーティングのスキーマ */
export const ratingLabelSchema = z
  .object({
    name: z.string(),
    min: z.number(),
    max: z.number(),
  })
  .refine((d) => d.min < d.max, { message: "min must be less than max" });

/** レーティング JSON 構造 */
export type RatingLabel = z.infer<typeof ratingLabelSchema>;

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
 * @param label フィールドラベル
 */
export const validateFieldValue = (value: FieldValue, type: FieldType, label?: string): void => {
  fieldValueSchemaByType[type].parse(value);

  if (type === "rating" && typeof value === "number" && label) {
    const parsed = ratingLabelSchema.safeParse(JSON.parse(label));
    const min = parsed.success ? parsed.data.min : RATING_DEFAULT_MIN;
    const max = parsed.success ? parsed.data.max : RATING_DEFAULT_MAX;
    z.number().min(min).max(max).parse(value);
  }

  if (type === "location" && typeof value === "string" && value) {
    locationDataSchema.parse(JSON.parse(value));
  }
};

/**
 * 各エントリー入力のデフォルト値
 * @param type フィールドタイプ
 * @param label フィールドラベル（rating の場合に min を取得するために使用）
 */
export const getDefaultValue = (type: FieldType, label?: string): FieldValue => {
  switch (type) {
    case "text":
    case "longText":
    case "link":
      return "";
    case "number":
      return 0;
    case "rating": {
      if (!label) return RATING_DEFAULT_MIN;
      const parsed = ratingLabelSchema.safeParse(JSON.parse(label));
      return parsed.success ? parsed.data.min : RATING_DEFAULT_MIN;
    }
    case "check":
      return false;
    case "date":
    case "time":
      return new Date();
    default:
      return null;
  }
};

/**
 * FieldValue を DB の text 型に変換
 * @param value フィールドの値
 */
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
    case "rating":
      return Number(value);
    case "check":
      return value === "true";
    case "date":
    case "time":
      return new Date(Number(value));
    case "media":
      return value;
    case "location":
      return value;
    default:
      return value;
  }
};

/**
 * 数値入力文字列から数字・小数点・マイナス以外を除去する
 * @param v 入力文字列
 * @param decimalPlaces 許可する小数桁数
 */
export const cleanNumericInput = (v: string, decimalPlaces?: number): string => {
  const digitsOnly = v.replace(/[^0-9.-]/g, "");
  const decimals = decimalPlaces != null ? `{0,${decimalPlaces}}` : "*";
  return digitsOnly.replace(new RegExp(`^(-?\\d*\\.?\\d${decimals}).*`), "$1");
};
