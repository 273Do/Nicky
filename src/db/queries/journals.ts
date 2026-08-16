import { and, eq, notInArray, sql } from "drizzle-orm";

import { db } from "@/db/client";
import { entries, fields, JournalObj, journals } from "@/db/schemas";
import { FieldWithSortObj, JournalMetaObj } from "@/hooks/journal/use-journal-field";

/**
 * ジャーナル一覧を取得するクエリ
 */
export const getJournalsQuery = db.query.journals.findMany({
  extras: {
    entryCount:
      sql<number>`(select count(*) from ${entries} where ${entries.journalId} = journals.id)`.as(
        "entry_count",
      ),
  },
});

/**
 * ジャーナル詳細を取得するクエリ
 * @param journalId エントリーID
 */
export const getJournalDetailQuery = (journalId: string) =>
  db.query.journals.findFirst({
    where: (journals, { eq }) => eq(journals.id, journalId),
    with: {
      fields: true,
    },
  });

/** ジャーナル詳細の型 */
export type JournalDetail = NonNullable<Awaited<ReturnType<typeof getJournalDetailQuery>>>;

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
        .values(newFields.map((field) => ({ ...field, journalId: newJournal.id })));
    }
  });
};

/**
 * ジャーナルのメタ情報とフィールドラベル・順序を更新する
 * @param journalId ジャーナルID
 * @param meta 更新するメタ情報
 * @param fieldUpdates 更新するフィールド一覧
 */
export const updateJournal = async (
  journalId: string,
  meta: JournalMetaObj,
  fieldUpdates: FieldWithSortObj[],
): Promise<void> => {
  const { name, icon, color } = meta;

  await db.transaction(async (tx) => {
    await tx
      .update(journals)
      .set({
        name,
        icon,
        color,
        updatedAt: Date.now(),
      })
      .where(eq(journals.id, journalId));

    // 既存フィールドは更新、新規フィールドは挿入
    if (fieldUpdates.length > 0) {
      await tx
        .insert(fields)
        .values(fieldUpdates.map((f) => ({ ...f, journalId })))
        .onConflictDoUpdate({
          target: fields.id,
          set: {
            label: sql`excluded.label`,
            sortOrder: sql`excluded."sortOrder"`,
          },
        });

      // 新リストに存在しないフィールドを削除
      await tx.delete(fields).where(
        and(
          eq(fields.journalId, journalId),
          notInArray(
            fields.id,
            fieldUpdates.map((f) => f.id),
          ),
        ),
      );
    }

    // entries.updatedAt を touch して useLiveQuery に変更を伝播させる
    await tx.update(entries).set({ updatedAt: Date.now() }).where(eq(entries.journalId, journalId));
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

/**
 * ジャーナルに紐づくフィールド一覧を取得するクエリ（変更検知用）
 * @param journalId ジャーナルID
 */
export const getFieldsByJournalQuery = (journalId: string) =>
  db.query.fields.findMany({
    where: (f, { eq }) => eq(f.journalId, journalId),
  });
