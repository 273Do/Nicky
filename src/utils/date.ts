/**
 * 日付を "yyyy年mm月dd日" / "May 5, 2026" などロケールに応じた形式でフォーマットする関数
 * @param date フォーマットする日付
 * @return フォーマットされた日付文字列
 */
export const formatDate = (date: Date | number): string => {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
};

/**
 * 年月を "2026年5月" / "May 2026" などロケールに応じた形式でフォーマットする関数
 * @param date フォーマットする日付
 * @returns フォーマットされた年月文字列
 */
export const formatYearMonth = (date: Date | number): string => {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
  }).format(date);
};
