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
