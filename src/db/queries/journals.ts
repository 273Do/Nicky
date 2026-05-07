import { sql } from "drizzle-orm";

import { db } from "@/db/client";
import { entries, FieldlObj, fields, JournalObj, journals } from "@/db/schemas";

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
 * @param journal ジャーナルのメタ情報
 * @param newFields フィールド一覧
 */
export const storeJournal = async (
  journal: JournalObj,
  newFields: FieldlObj[],
) => {
  await db.transaction(async (tx) => {
    await tx.insert(journals).values(journal);

    if (newFields.length > 0) {
      await tx
        .insert(fields)
        .values(
          newFields.map((field) => ({ ...field, journalId: journal.id })),
        );
    }
  });
};

/** ジャーナル一覧の型 */
export type JournalWithCountObj = Awaited<typeof getJournalsQuery>[number];
