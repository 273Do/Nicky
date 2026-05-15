import { eq, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { entries, fields, JournalObj, journals } from "@/db/schemas";
import { FieldWithSortObj } from "@/utils/journal/use-journal-field";

/**
 * ジャーナル一覧を取得するクエリ
 */
export const getJournalsQuery = db.query.journals.findMany({
  extras: {
    entryCount:
      sql<number>`(select count(*) from ${entries} where ${entries.journalId} = ${journals.id})`.as(
        "entry_count",
      ),
  },
});

/**
 * ジャーナルをフィールドと共に作成するクエリを実行
 * @param newJournal ジャーナルのメタ情報
 * @param newFields フィールド一覧
 */
export const storeJournal = async (
  newJournal: JournalObj,
  newFields: FieldWithSortObj[],
): Promise<void> => {
  await db.transaction(async (tx) => {
    await tx.insert(journals).values(newJournal);

    if (newFields.length > 0) {
      await tx
        .insert(fields)
        .values(
          newFields.map((field) => ({ ...field, journalId: newJournal.id })),
        );
    }
  });
};

/**
 * ジャーナルを削除するクエリ
 * @param journalId ジャーナルID
 */
export const deleteJournal = async (journalId: string) => {
  await db.delete(journals).where(eq(journals.id, journalId));
};

/** ジャーナル一覧の型 */
export type JournalWithCountObj = Awaited<typeof getJournalsQuery>[number];
