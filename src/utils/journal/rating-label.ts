import { RatingLabel, ratingLabelSchema } from "../entry/field-value";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

/**
 * rating フィールドのラベルを JSON エンコードする
 * @param name フィールド名
 * @param min 最小値
 * @param max 最大値
 */
export const encodeRatingLabel = (name: string, min: number, max: number): string =>
  JSON.stringify({ name, min, max });

/**
 * rating フィールドのラベルを JSON デコードする
 * パース失敗時はフォールバック (min:0, max:100)
 * @param label エンコード済みラベル文字列
 */
export const decodeRatingLabel = (label: string): RatingLabel => {
  try {
    return ratingLabelSchema.parse(JSON.parse(label));
  } catch {
    return { name: label, min: DEFAULT_MIN, max: DEFAULT_MAX };
  }
};
