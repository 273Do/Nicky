import { PlatformColor } from "react-native";

import { ChartDataPoint } from "@expo/ui/swift-ui";

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

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/**
 * 週間のエントリーをチャートに表示するためのフォーマット関数
 * @param timestamps エントリーのタイムスタンプリスト
 * @param accentColor チャートに表示するアクセントカラー
 */
export const chartDateFormat = (
  timestamps: number[],
  accentColor: string,
): ChartDataPoint[] => {
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Mon=0, Sun=6

  return [...timestamps]
    .sort((a, b) => a - b)
    .map((ts) => {
      const date = new Date(ts);
      const dayIndex = (date.getUTCDay() + 6) % 7;
      const hour = date.getUTCHours() + date.getUTCMinutes() / 60;
      const color =
        dayIndex === todayDayIndex ? accentColor : PlatformColor("systemGray3");
      return { x: DAY_LABELS[dayIndex], y: hour, color };
    });
};
