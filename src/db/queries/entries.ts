import { and, eq, gte, lt } from "drizzle-orm";

import { db } from "@/db/client";
import { addDays, startOfDay } from "@/utils/date";

import { entries, EntryObj, EntryValueObj, entryValues } from "../schemas";

/**
 * ジャーナルに紐付いたエントリー一覧をフィールドとともに取得するクエリ
 * @param journalId ジャーナルID
 */
export const getEntriesQuery = (journalId: string) =>
  db.query.entries.findMany({
    where: (entries, { eq }) => eq(entries.journalId, journalId),
    with: {
      values: {
        with: { field: true },
      },
    },
  });

/**
 * エントリー詳細を取得するクエリ
 * @param entryId エントリーID
 */
export const getEntryDetailQuery = (entryId: string) =>
  db.query.entries.findFirst({
    where: (entries, { eq }) => eq(entries.id, entryId),
    with: {
      values: {
        with: { field: true },
      },
    },
  });

/**
 * エントリーをフィールド値と共に保存する
 * @param newEntry エントリー本体
 * @param newValues エントリー値一覧
 */
export const storeEntry = async (newEntry: EntryObj, newValues: EntryValueObj[]): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.insert(entries).values(newEntry);

    if (newValues.length > 0) {
      await tx.insert(entryValues).values(newValues);
    }
  });
};

/**
 * エントリーのフィールド値を更新する
 * @param entryId エントリーID
 * @param values 更新するフィールド値一覧
 */
export const updateEntryValues = async (
  entryId: string,
  values: { fieldId: string; value: string | null }[],
): Promise<void> => {
  await db.transaction(async (tx) => {
    for (const { fieldId, value } of values) {
      await tx
        .update(entryValues)
        .set({ value })
        .where(and(eq(entryValues.entryId, entryId), eq(entryValues.fieldId, fieldId)));
    }
    await tx.update(entries).set({ updatedAt: Date.now() }).where(eq(entries.id, entryId));
  });
};

/**
 * エントリーをブックマーク登録・解除するクエリ
 * @param entryId エントリーID
 * @param bookmark ブックマークフラグ
 */
export const bookmarkEntry = async (entryId: string, bookmark: boolean) => {
  await db.update(entries).set({ bookmark }).where(eq(entries.id, entryId));
};

/**
 * エントリー詳細を削除するクエリ
 * @param entryId エントリーID
 */
export const deleteEntry = async (entryId: string) => {
  await db.delete(entries).where(eq(entries.id, entryId));
};

/**
 * 全てのエントリーを削除するクエリ
 * @param journalId ジャーナルID
 */
export const deleteAllEntries = async (journalId?: string) => {
  if (journalId) {
    await db.delete(entries).where(eq(entries.journalId, journalId));
  } else {
    await db.delete(entries);
  }
};

/**
 * 指定日のエントリー一覧をフィールドとともに取得するクエリ
 * @param date 対象日（時刻は無視される）
 */
export const getEntriesByDateQuery = (date: Date) => {
  const start = startOfDay(date);
  const end = addDays(start, 1);

  return db.query.entries.findMany({
    where: and(gte(entries.createdAt, start.getTime()), lt(entries.createdAt, end.getTime())),
    with: {
      journal: true,
      values: {
        with: { field: true },
      },
    },
  });
};

/**
 * 日付範囲のエントリー一覧をフィールドとともに取得するクエリ
 * @param start 開始日（0:00:00）
 * @param end 終了日の翌日（0:00:00、この日は含まない）
 */
export const getEntriesByRangeQuery = (start: Date, end: Date) =>
  db.query.entries.findMany({
    where: and(gte(entries.createdAt, start.getTime()), lt(entries.createdAt, end.getTime())),
    with: {
      journal: true,
      values: {
        with: { field: true },
      },
    },
  });

/** エントリー詳細の型 */
export type EntryDetailObj = Awaited<ReturnType<typeof getEntriesQuery>>[number];

/** 日付ベースのエントリー詳細の型（journal を含む） */
export type DailyEntryObj = Awaited<ReturnType<typeof getEntriesByDateQuery>>[number];
