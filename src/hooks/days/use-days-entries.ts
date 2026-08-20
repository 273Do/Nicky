import { useRef } from "react";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { type DailyEntryObj, getEntriesByRangeQuery } from "@/db/queries/entries";
import { addDays, startOfDay } from "@/utils/date";

/** 前後何日分をまとめて取得するか（片側） */
const RANGE_DAYS = 3;

/** 範囲の端からこの日数以内に近づいたら範囲を再計算する */
const BOUNDARY_DAYS = 3;

type Range = { start: Date; end: Date };

const computeRange = (center: Date): Range => ({
  start: addDays(center, -RANGE_DAYS),
  end: addDays(center, RANGE_DAYS + 1),
});

const isNearBoundary = (date: Date, range: Range) => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysFromStart = (date.getTime() - range.start.getTime()) / msPerDay;
  const daysFromEnd = (range.end.getTime() - date.getTime()) / msPerDay;
  return daysFromStart < BOUNDARY_DAYS || daysFromEnd < BOUNDARY_DAYS;
};

const dateKey = (ts: number) => startOfDay(new Date(ts)).getTime();

const groupByDate = (entries: DailyEntryObj[]) => {
  const map = new Map<number, DailyEntryObj[]>();
  for (const entry of entries) {
    const key = dateKey(entry.createdAt);
    const arr = map.get(key);
    if (arr) arr.push(entry);
    else map.set(key, [entry]);
  }
  return map;
};

/**
 * selectedDate を中心に前後 RANGE_DAYS 分のエントリーをまとめて取得し、
 * 日付ごとにグルーピングして返すフック。
 * スワイプのたびに DB 再購読は発生しない。
 */
export const useDaysEntries = (selectedDate: Date) => {
  const rangeRef = useRef<Range>(computeRange(selectedDate));

  if (isNearBoundary(selectedDate, rangeRef.current)) {
    rangeRef.current = computeRange(selectedDate);
  }

  const range = rangeRef.current;

  const { data: allEntries } = useLiveQuery(getEntriesByRangeQuery(range.start, range.end), [
    range.start.getTime(),
    range.end.getTime(),
  ]);

  return groupByDate(allEntries);
};
