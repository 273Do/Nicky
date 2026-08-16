import { Keyboard } from "react-native";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { bookmarkEntry, deleteEntry, getEntryDetailQuery } from "@/db/queries/entries";
import { buildEntryFormData } from "@/utils/entry/entry-form";

import { useEntry } from "./use-entry";

/**
 * エントリー詳細画面のデータ取得・フォーム状態・アクションをまとめたフック
 * @param entryId エントリー id
 */
export function useEntryDetail(entryId: string) {
  const { data: entry } = useLiveQuery(getEntryDetailQuery(entryId), [entryId]);

  const { fields, initialValues } = entry
    ? buildEntryFormData(entry)
    : { fields: [], initialValues: null };

  const { valuesRef, setValue, updateEntry } = useEntry(fields, initialValues);

  /** 編集内容を保存する */
  const save = async () => {
    Keyboard.dismiss();
    await updateEntry(entryId);
  };

  /** ブックマーク状態を切り替える */
  const bookmark = async () => {
    if (entry) await bookmarkEntry(entry.id, !entry.bookmark);
  };

  /** エントリーを削除する */
  const remove = async () => {
    await deleteEntry(entryId);
  };

  return { entry, valuesRef, setValue, save, bookmark, remove };
}
