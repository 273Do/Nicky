import { PlatformColor } from "react-native";

import { ChartDataPoint } from "@expo/ui/swift-ui";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type FieldValueEntry = { createdAt: number; value: string | null };

/**
 * 週間のエントリーをチャートに表示するためのフォーマット関数
 * 過去7日間を固定ウィンドウとして表示（横軸: 曜日、縦軸: 時刻）
 * @param timestamps エントリーのタイムスタンプリスト
 * @param accentColor 今日のポイントに使うアクセントカラー
 */
export const chartDateFormat = (
  timestamps: number[],
  accentColor: string,
): { data: ChartDataPoint[]; count: number } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const data: ChartDataPoint[] = [];
  let count = 0;

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const dayStr = day.toDateString();
    const isToday = i === 6;
    const label = DAY_LABELS[(day.getDay() + 6) % 7];
    const color = isToday ? accentColor : PlatformColor("systemGray3");

    const dayTimestamps = timestamps.filter(
      (ts) => new Date(ts).toDateString() === dayStr,
    );

    count += dayTimestamps.length;

    for (const ts of dayTimestamps) {
      const date = new Date(ts);
      data.push({
        x: label,
        y: date.getHours() + date.getMinutes() / 60,
        color,
      });
    }

    // エントリーがない日もプレースホルダーを入れて7日分を維持
    if (dayTimestamps.length === 0) {
      data.push({
        x: label,
        y: 0,
        color: PlatformColor("secondarySystemGroupedBackground"),
      });
    }
  }

  return { data, count };
};

/**
 * 過去7日間のフィールド値を棒グラフ用にフォーマットする関数
 * @param fieldValues フィールド値一覧
 * @param accentColor 今日のバーに使うアクセントカラー
 */
export const chartNumberFormat = (
  fieldValues: FieldValueEntry[],
  accentColor: string,
): ChartDataPoint[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const dayStr = day.toDateString();
    const isToday = i === 6;

    const dayEntries = fieldValues.filter(
      (fv) =>
        new Date(fv.createdAt).toDateString() === dayStr && fv.value !== null,
    );
    const avgY =
      dayEntries.length > 0
        ? dayEntries.reduce((sum, fv) => sum + Number(fv.value ?? "0"), 0) /
          dayEntries.length
        : 0;

    return {
      x: DAY_LABELS[(day.getDay() + 6) % 7],
      y: avgY,
      color:
        dayEntries.length === 0
          ? PlatformColor("secondarySystemGroupedBackground")
          : isToday
            ? accentColor
            : PlatformColor("systemGray3"),
    };
  });
};

/**
 * チェックフィールドの値を棒グラフ用にフォーマット（1日のチェック数）
 */
export const chartCheckFormat = (
  fieldValues: FieldValueEntry[],
  accentColor: string,
): ChartDataPoint[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const dayStr = day.toDateString();
    const isToday = i === 6;

    const dayEntries = fieldValues.filter(
      (fv) => new Date(fv.createdAt).toDateString() === dayStr,
    );
    const checkCount = dayEntries.filter((fv) => fv.value === "true").length;

    return {
      x: DAY_LABELS[(day.getDay() + 6) % 7],
      y: checkCount,
      color:
        checkCount === 0
          ? PlatformColor("secondarySystemGroupedBackground")
          : isToday
            ? accentColor
            : PlatformColor("systemGray3"),
    };
  });
};

/**
 * 日付・時刻フィールドの値を散布図用にフォーマット
 * y軸は時間（0〜24の小数）
 */
export const chartTimeScatterFormat = (
  fieldValues: FieldValueEntry[],
  accentColor: string,
): ChartDataPoint[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const data: ChartDataPoint[] = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const dayStr = day.toDateString();
    const isToday = i === 6;
    const label = DAY_LABELS[(day.getDay() + 6) % 7];
    const color = isToday ? accentColor : PlatformColor("systemGray3");

    const dayEntries = fieldValues.filter(
      (fv) =>
        new Date(fv.createdAt).toDateString() === dayStr && fv.value !== null,
    );

    if (dayEntries.length === 0) {
      data.push({
        x: label,
        y: 0,
        color: PlatformColor("secondarySystemGroupedBackground"),
      });
    } else {
      for (const fv of dayEntries) {
        const date = new Date(Number(fv.value));
        data.push({
          x: label,
          y: date.getHours() + date.getMinutes() / 60,
          color,
        });
      }
    }
  }

  return data;
};

/**
 * 過去7日間のフィールド値を棒グラフ用にフォーマットする関数
 * @param fieldValues フィールド値一覧
 * @param accentColor 今日のバーに使うアクセントカラー
 */
export const chartFieldValueFormat = (
  fieldValues: FieldValueEntry[],
  accentColor: string,
): ChartDataPoint[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (6 - i));
    const dayStr = day.toDateString();
    const isToday = i === 6;

    const dayEntries = fieldValues.filter(
      (fv) => new Date(fv.createdAt).toDateString() === dayStr,
    );
    const avgY =
      dayEntries.length > 0
        ? dayEntries.reduce((sum, fv) => sum + (fv.value?.length ?? 0), 0) /
          dayEntries.length
        : 0;

    return {
      x: DAY_LABELS[(day.getDay() + 6) % 7],
      y: avgY,
      color:
        dayEntries.length === 0
          ? PlatformColor("secondarySystemGroupedBackground")
          : isToday
            ? accentColor
            : PlatformColor("systemGray3"),
    };
  });
};
