import { useState } from "react";

import * as Crypto from "expo-crypto";
import { z } from "zod";

import { DEFAULT_JOURNAL_COLOR, type FieldType, JOURNAL_ICONS } from "@/constants/journal";
import { RATING_DEFAULT_MAX, RATING_DEFAULT_MIN } from "@/constants/validation";
import { storeJournal, updateJournal as updateJournalQuery } from "@/db/queries/journals";
import { type JournalObj } from "@/db/schemas";
import {
  type FieldDraftObj,
  type FieldWithSortObj,
  type JournalMetaObj,
  fieldDraftSchema,
  journalMetaSchema,
} from "@/utils/journal/journal-field";
import { decodeRatingLabel, encodeRatingLabel } from "@/utils/journal/rating-label";

export type {
  FieldDraftObj,
  FieldWithSortObj,
  JournalMetaObj,
} from "@/utils/journal/journal-field";
export { FIELD_TYPES } from "@/utils/journal/journal-field";

const defaultMeta: JournalMetaObj = {
  name: "",
  color: DEFAULT_JOURNAL_COLOR,
  icon: JOURNAL_ICONS[0],
};

/**
 * ジャーナルフィールドに関するフック
 * @param meta ジャーナルのメタ情報(編集用)
 * @param fields 現在のフィールド一覧(編集用)
 * @returns
 * - fields 現在のフィールド一覧
 * - addField 新規フィールドを追加する関数
 * - renameFileld フィールドのラベルを更新する関数
 * - removeField フィールドを削除する関数
 * - moveField フィールドを並び替えする関数
 * - meta ジャーナルのメタ情報
 * - setMeta ジャーナルのメタ情報をセットする関数
 * - createJournal 新規ジャーナルを作成する関数
 * - updateJournal ジャーナルを更新する関数
 * - formDisabled フォームが送信可能かどうかのフラグ
 */
export const useJournalField = (initialData?: {
  meta: JournalMetaObj;
  fields: FieldDraftObj[];
}) => {
  const [fields, setFields] = useState<FieldDraftObj[]>(initialData?.fields ?? []);
  const [meta, setMeta] = useState<JournalMetaObj>(initialData?.meta ?? defaultMeta);

  /**
   * 新規フィールドを追加する
   * @param type 追加するフィールドの種別
   */
  const addField = (type: FieldType): void => {
    const newField: FieldDraftObj = {
      id: Crypto.randomUUID(),
      type,
      label: type === "rating" ? encodeRatingLabel("", RATING_DEFAULT_MIN, RATING_DEFAULT_MAX) : "",
    };
    setFields((prev) => [...prev, newField]);
  };

  /**
   * フィールドのラベルを更新する関数
   * @param id ラベルを編集する id
   * @param newLabel 新しいラベル
   */
  const renameField = (id: string, newLabel: string): void => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== id) return field;
        if (field.type === "rating") {
          const decoded = decodeRatingLabel(field.label);
          return { ...field, label: encodeRatingLabel(newLabel, decoded.min, decoded.max) };
        }
        return { ...field, label: newLabel };
      }),
    );
  };

  /**
   * rating フィールドの min/max を更新する関数
   * @param id フィールド ID
   * @param min 最小値
   * @param max 最大値
   */
  const updateRatingRange = (id: string, min: number, max: number): void => {
    setFields((prev) =>
      prev.map((field) => {
        if (field.id !== id || field.type !== "rating") return field;
        const decoded = decodeRatingLabel(field.label);
        return { ...field, label: encodeRatingLabel(decoded.name, min, max) };
      }),
    );
  };

  /**
   * インデックス指定でフィールドを削除する（List.ForEach の onDelete 用）
   * @param indices 削除するインデックスの配列
   */
  const deleteField = (indices: number[]): void => {
    setFields((prev) => prev.filter((_, i) => !indices.includes(i)));
  };

  /**
   * フィールドを並び替える
   * @param sourceIndices 移動元のインデックス配列
   * @param destination 移動先のインデックス
   */
  const moveField = (sourceIndices: number[], destination: number): void => {
    setFields((prev) => {
      const next = [...prev];
      const moved = sourceIndices.map((i) => next[i]);
      sourceIndices.sort((a, b) => b - a).forEach((i) => next.splice(i, 1));
      next.splice(destination, 0, ...moved);
      return next;
    });
  };

  /**
   * formDisabled フォームが送信可能かどうかのフラグ
   */
  const formDisabled =
    !journalMetaSchema.safeParse(meta).success ||
    !z.array(fieldDraftSchema).min(1).safeParse(fields).success ||
    fields.some((f) => {
      if (f.type !== "rating") return false;
      const { name, min, max } = decodeRatingLabel(f.label);
      return !name.trim() || min >= max;
    });

  /**
   * 新規ジャーナルをフィールドと共にDBに保存する
   */
  const createJournal = async (): Promise<JournalObj> => {
    journalMetaSchema.parse(meta);
    z.array(fieldDraftSchema).min(1).parse(fields);

    const now = Date.now();

    const newJournal: JournalObj = {
      id: Crypto.randomUUID(),
      name: meta.name,
      icon: meta.icon,
      color: meta.color,
      createdAt: now,
      updatedAt: now,
    };

    const newFieldsFieldObj: FieldWithSortObj[] = fields.map((field, i) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      sortOrder: i,
    }));

    await storeJournal(newJournal, newFieldsFieldObj);

    return newJournal;
  };

  /**
   * 既存ジャーナルのメタ情報とフィールドをDBに更新する
   * @param journalId ジャーナルID
   */
  const updateJournal = async (journalId: string): Promise<void> => {
    journalMetaSchema.parse(meta);
    z.array(fieldDraftSchema).min(1).parse(fields);

    const fieldUpdates: FieldWithSortObj[] = fields.map((field, i) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      sortOrder: i,
    }));

    await updateJournalQuery(journalId, meta, fieldUpdates);
  };

  return {
    fields,
    setFields,
    addField,
    renameField,
    updateRatingRange,
    deleteField,
    moveField,

    meta,
    setMeta,
    createJournal,
    updateJournal,

    formDisabled,
  };
};
