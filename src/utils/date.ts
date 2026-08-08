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

/**
 * 日付を "May 5" または "May 5, 2026" などロケールに応じた形式でフォーマットする関数
 * @param date フォーマットする日付
 * @returns フォーマットされた日付文字列
 */
export const formatDateDays = (date: Date) =>
  // 今年でない場合は年を表示する
  date.getFullYear() === new Date().getFullYear()
    ? date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

/** 日付を n 日ずらす
 * @param date 基準日付
 * @param days 日数
 * @returns ずらされた日付
 */
export const addDays = (date: Date, days: number) => {
  const d = new Date(date);

  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);

  return d;
};
