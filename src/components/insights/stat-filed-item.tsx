import { EntryDetailObj } from "@/db/queries/entries";
import { FieldObj } from "@/db/schemas";

import { StatCardCheck } from "./stat-card-check";
import { StatCardDate } from "./stat-card-date";
import { StatCardLongText } from "./stat-card-long-text";
import { StatCardNumber } from "./stat-card-number";
import { StatCardText } from "./stat-card-text";
import { StatCardTime } from "./stat-card-time";

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

  switch (field.type) {
    case "text":
      return <StatCardText {...shared} />;
    case "longText":
      return <StatCardLongText {...shared} />;
    case "number":
      return <StatCardNumber {...shared} />;
    case "check":
      return <StatCardCheck {...shared} />;
    case "date":
      return <StatCardDate {...shared} />;
    case "time":
      return <StatCardTime {...shared} />;
  }
}
