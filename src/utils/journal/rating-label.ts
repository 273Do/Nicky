import { RatingLabel, ratingLabelSchema } from "../entry/field-value";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;

/**
 * rating フィールドのラベルを JSON エンコードする
 */
export const encodeRatingLabel = (name: string, min: number, max: number): string =>
  JSON.stringify({ name, min, max });

/**
 * rating フィールドのラベルを JSON デコードする
 * パース失敗時はフォールバック (min:0, max:100)
 */
export const decodeRatingLabel = (label: string): RatingLabel => {
  try {
    return ratingLabelSchema.parse(JSON.parse(label));
  } catch {
    return { name: label, min: DEFAULT_MIN, max: DEFAULT_MAX };
  }
};
