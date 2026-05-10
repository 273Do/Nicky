import { EntryNumber } from "@/components/field/emtry-number";
import { EntryCheck } from "@/components/field/entry-check";
import { EntryDate } from "@/components/field/entry-date";
import { EntryLocation } from "@/components/field/entry-location";
import { EntryLongText } from "@/components/field/entry-long-text";
import { EntryMedia } from "@/components/field/entry-media";
import { EntryText } from "@/components/field/entry-text";
import { EntryTime } from "@/components/field/entry-time";
import { FieldType } from "@/core/constants";
import type { FieldlObj } from "@/db/schemas";
import { type FieldValue } from "@/utils/entry/use-entry";

type Props = {
  /** フィールド定義 */
  field: FieldlObj;
  /** 現在の値 */
  value: FieldValue;
  /** 値変更時のコールバック */
  setValue: (id: string, value: FieldValue) => void;
};

/**
 * フィールドタイプによってコンポーネントを切り替えるコンポーネント
 * React Compiler がこの単位で再レンダリングを最適化する
 */
export function EntryFieldItem({ field, value, setValue }: Props) {
  const shared = {
    label: field.label,
    onValueChange: <T extends FieldValue>(v: T) => setValue(field.id, v),
    edit: true,
  };

  switch (field.type as FieldType) {
    case "text":
      return <EntryText {...shared} defaultValue={value as string} />;
    case "longText":
      return <EntryLongText {...shared} defaultValue={value as string} />;
    case "number":
      return <EntryNumber {...shared} defaultValue={(value ?? 0) as number} />;
    case "check":
      return <EntryCheck {...shared} defaultValue={value as boolean} />;
    case "date":
      return <EntryDate {...shared} defaultValue={value as Date} />;
    case "time":
      return <EntryTime {...shared} defaultValue={value as Date} />;
    case "media":
      return <EntryMedia {...shared} />;
    case "location":
      return <EntryLocation {...shared} />;
  }
}
