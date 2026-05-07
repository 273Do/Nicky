import { db } from "@/db/client";

/**
 * ジャーナルに紐付いたエントリー一覧を取得するクエリ
 * @param journalId ジャーナルID
 */
export const getEntriesQuery = (journalId: string) =>
  db.query.entries.findMany({
    where: (entries, { eq }) => eq(entries.journalId, journalId),
    with: { values: true },
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

/** エントリー詳細の型 */
export type EntryDetailObj = NonNullable<
  Awaited<ReturnType<typeof getEntryDetailQuery>>
>;
