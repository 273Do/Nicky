import { FieldType } from "@/core/constants";
import { EntryDetailObj } from "@/db/queries/entries";
import { FieldObj } from "@/db/schemas";

import { StatCardText } from "./stat-card-text";

export type FieldValueEntry = {
  createdAt: number;
  value: string | null;
};

type Props = {
  /** フィールド定義 */
  field: FieldObj;
  /** アクセントカラー */
  accentColor: string;
  /** エントリー一覧 */
  entries: EntryDetailObj[];
};

/**
 * フィールドタイプによってフィールドの統計を切り替えるコンポーネント
 */
export function StatFieldItem({ field, accentColor, entries }: Props) {
  const fieldValues: FieldValueEntry[] = entries
    .filter((entry) => entry.values.some((v) => v.fieldId === field.id))
    .map((entry) => ({
      createdAt: entry.createdAt,
      value: entry.values.find((v) => v.fieldId === field.id)?.value ?? null,
    }));

  const shared = { label: field.label, accentColor, fieldValues };

  switch (field.type as FieldType) {
    case "text":
      return <StatCardText {...shared} />;
  }
  // switch (field.type as FieldType) {
  //   case "text":
  //     return <EntryText {...shared} defaultValue={value as string} />;
  //   case "longText":
  //     return <EntryLongText {...shared} defaultValue={value as string} />;
  //   case "number":
  //     return <EntryNumber {...shared} defaultValue={(value ?? 0) as number} />;
  //   case "check":
  //     return <EntryCheck {...shared} defaultValue={value as boolean} />;
  //   case "date":
  //     return <EntryDate {...shared} defaultValue={value as Date} />;
  //   case "time":
  //     return <EntryTime {...shared} defaultValue={value as Date} />;
  //   case "media":
  //     return <EntryMedia {...shared} />;
  //   case "location":
  //     return <EntryLocation {...shared} />;
  // }
}
