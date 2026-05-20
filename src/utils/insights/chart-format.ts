import { PlatformColor } from "react-native";

import { ChartDataPoint } from "@expo/ui/swift-ui";

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
