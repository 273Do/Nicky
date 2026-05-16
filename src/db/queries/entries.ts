import { eq } from "drizzle-orm";

import { db } from "@/db/client";

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
export const storeEntry = async (
  newEntry: EntryObj,
  newValues: EntryValueObj[],
): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.insert(entries).values(newEntry);

    if (newValues.length > 0) {
      await tx.insert(entryValues).values(newValues);
    }
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

/** エントリー詳細の型 */
export type EntryDetailObj = Awaited<
  ReturnType<typeof getEntriesQuery>
>[number];
