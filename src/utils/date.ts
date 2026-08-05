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
 * 時刻を "13:05" などロケールに応じた形式でフォーマットする関数
 * @param date フォーマットする日付
 * @returns フォーマットされた時刻文字列
 */
export const formatTime = (date: Date | number): string => {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};
