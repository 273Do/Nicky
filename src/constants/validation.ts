/** ジャーナル名の最大文字数 */
export const JOURNAL_NAME_MAX = 20;

/** フィールドラベルの最大文字数（rating は JSON エンコード後の文字列が入る） */
export const FIELD_LABEL_MAX = 100;

/** テキストフィールドの最大文字数 */
export const TEXT_FIELD_MAX = 40;

/** AI 振り返りの言語別文字数制限 */
export const REFLECTION_LIMITS = {
  ja: { title: 15, content: 80 },
  en: { title: 60, content: 250 },
} as const;

/** AI 振り返りの項目数 */
export const REFLECTION_ITEMS_COUNT = 2;

/** rating フィールドのデフォルト最小値 */
export const RATING_DEFAULT_MIN = 0;

/** rating フィールドのデフォルト最大値 */
export const RATING_DEFAULT_MAX = 100;
