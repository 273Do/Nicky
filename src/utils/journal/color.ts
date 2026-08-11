import { z } from "zod";

/** HEX 形式のみチェック（輝度チェックなし） */
const hexFormatSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

/**
 * 16進数カラーコードを明るくする
 * @param hex 16進数カラーコード
 * @param amount 明るさの加算量（デフォルト: 40）
 */
export const lightenColor = (hex: string, amount = 40): string => {
  hexFormatSchema.parse(hex);
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
};

/**
 * 黒・白に近すぎる色を弾く（輝度が極端な色を除外）
 * @param hex 16進数カラーコード
 */
const isValidLuminance = (hex: string): boolean => {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = ((num >> 16) & 0xff) / 255;
  const g = ((num >> 8) & 0xff) / 255;
  const b = (num & 0xff) / 255;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.05 && luminance < 0.9;
};

/**
 * HEX カラーコードの Zod スキーマ（形式 + 輝度バリデーション）
 */
export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/)
  .refine(isValidLuminance, { message: "Color luminance is too extreme" });
