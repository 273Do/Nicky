import { useState } from "react";

import * as Crypto from "expo-crypto";
import type { SFSymbol } from "sf-symbols-typescript";

import { FIELD_ICONS, FieldType, JOURNAL_ICONS } from "@/core/constants";

/**
 * ジャーナルの型
 */
export type JournalObj = {
  id: string;
  meta: JournalMetaObj;
  fields: FieldObj[];
};

/**
 * ジャーナルメタ情報の型
 */
export type JournalMetaObj = {
  name: string;
  color: string;
  icon: SFSymbol;
};

/**
 * ジャーナルフィールドの1項目
 */
export type FieldObj = {
  /** フィールドID */
  id: string;
  /** フィールド種別 */
  type: FieldType;
  /** 表示ラベル */
  label: string;
};

/**
 * 全 FieldType の配列
 */
export const FIELD_TYPES = Object.keys(FIELD_ICONS) as FieldType[];

/**
 * ジャーナルフィールドの管理フック
 * @returns
 * - fields 現在のフィールド一覧
 * - addField 新規フィールドを追加する関数
 * - renameFileld フィールドのラベルを更新する関数
 * - removeField フィールドを削除する関数
 * - moveField フィールドを並び替えする関数
 * - meta ジャーナルのメタ情報
 * - setMeta ジャーナルのメタ情報をセットする関数
 * - createJournal ジャーナルを作成する関数
 * - formDisabled フォームが送信可能かどうかのフラグ
 */
export const useJournalField = () => {
  const [fields, setFields] = useState<FieldObj[]>([]);

  const initialState = {
    name: "",
    color: "#007AFF",
    icon: JOURNAL_ICONS[0],
  };

  const [meta, setMeta] = useState<JournalMetaObj>(initialState);

  /**
   * 新規フィールドを追加する
   * @param type 追加するフィールドの種別
   */
  const addField = (type: FieldType) => {
    const newField: FieldObj = {
      id: Crypto.randomUUID(),
      type,
      label: "",
    };
    setFields((prev) => [...prev, newField]);
  };

  /**
   * フィールドのラベルを更新する関数
   * @param id ラベルを編集する id
   * @param newLabel 新しいラベル
   */
  const renameField = (id: string, newLabel: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, label: newLabel } : field,
      ),
    );
  };

  /**
   * インデックス指定でフィールドを削除する（List.ForEach の onDelete 用）
   * @param indices 削除するインデックスの配列
   */
  const deleteField = (indices: number[]) => {
    setFields((prev) => prev.filter((_, i) => !indices.includes(i)));
  };

  /**
   * フィールドを並び替える
   * @param sourceIndices 移動元のインデックス配列
   * @param destination 移動先のインデックス
   */
  const moveField = (sourceIndices: number[], destination: number) => {
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
    fields.length === 0 ||
    meta.name.length === 0 ||
    fields.some((field) => field.label.length === 0);

  /**
   * ジャーナルを作成する関数
   */
  const createJournal = () => {
    if (!formDisabled) {
      const newJournal: JournalObj = { id: Crypto.randomUUID(), meta, fields };
      console.log(newJournal);
      return newJournal;
    }
  };

  return {
    fields,
    addField,
    renameField,
    deleteField,
    moveField,

    meta,
    setMeta,
    createJournal,

    formDisabled,
  };
};
