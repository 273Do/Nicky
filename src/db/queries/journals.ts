import { db } from "@/db/client";
import { FieldlObj, fields, JournalObj, journals } from "@/db/schemas";

/**
 * ジャーナル一覧を取得する
 */
export const getJournals = async () => {
  return db.query.journals.findMany();
};

/**
 * ジャーナルに紐付いたエントリー一覧を取得する
 * @param journalId ジャーナルID
 */
export const getEntries = async (journalId: string) => {
  return db.query.journals.findFirst({
    where: (journals, { eq }) => eq(journals.id, journalId),
    with: { entries: true },
  });
};

/**
 * ジャーナルをフィールドと共に作成する
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
