import { db } from "../client";

/**
 * ジャーナルに紐付いたフィールド一覧を取得するクエリ
 * @param journalId ジャーナルID
 */
export const getFieldsQuery = (journalId: string) =>
  db.query.fields.findMany({
    where: (fields, { eq }) => eq(fields.journalId, journalId),
  });
