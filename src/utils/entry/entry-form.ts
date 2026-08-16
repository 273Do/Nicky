import { EntryDetailObj } from "@/db/queries/entries";
import { FieldObj } from "@/db/schemas";
import { deserializeValue, FieldValue } from "@/hooks/entry/use-entry";

/**
 * エントリー詳細からフォーム用のフィールド一覧と初期値を導出する
 * @param entry エントリー詳細
 */
export const buildEntryFormData = (
  entry: EntryDetailObj,
): {
  fields: FieldObj[];
  initialValues: Record<string, FieldValue>;
} => {
  const fields = [...entry.values]
    .sort((a, b) => a.field.sortOrder - b.field.sortOrder)
    .map((v) => v.field);

  const initialValues = Object.fromEntries(
    entry.values.map((v) => [v.fieldId, deserializeValue(v.value, v.field.type)]),
  );

  return { fields, initialValues };
};
