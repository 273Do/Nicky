import { EntryNumber } from "@/components/field/emtry-number";
import { EntryCheck } from "@/components/field/entry-check";
import { EntryDate } from "@/components/field/entry-date";
import { EntryLocation } from "@/components/field/entry-location";
import { EntryLongText } from "@/components/field/entry-long-text";
import { EntryMedia } from "@/components/field/entry-media";
import { EntryText } from "@/components/field/entry-text";
import { EntryTime } from "@/components/field/entry-time";
import type { FieldObj } from "@/db/schemas";
import { type FieldValue } from "@/utils/entry/use-entry";

type Props = {
  /** フィールド定義 */
  field: FieldObj;
  /** 現在の値 */
  value: FieldValue;
  /** 値変更時のコールバック（edit=true のときのみ必要） */
  setValue?: (id: string, value: FieldValue) => void;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * フィールドタイプによってコンポーネントを切り替えるコンポーネント
 * React Compiler がこの単位で再レンダリングを最適化する
 */
export function EntryFieldItem({
  field,
  value,
  setValue,
  edit = false,
}: Props) {
  const shared = {
    label: field.label,
    onValueChange: setValue
      ? <T extends FieldValue>(v: T) => setValue(field.id, v)
      : undefined,
    edit,
  };

  switch (field.type) {
    case "text":
      return (
        <EntryText
          {...shared}
          defaultValue={typeof value === "string" ? value : undefined}
        />
      );
    case "longText":
      return (
        <EntryLongText
          {...shared}
          defaultValue={typeof value === "string" ? value : undefined}
        />
      );
    case "number":
      return (
        <EntryNumber
          {...shared}
          defaultValue={typeof value === "number" ? value : undefined}
        />
      );
    case "check":
      return (
        <EntryCheck
          {...shared}
          defaultValue={typeof value === "boolean" ? value : undefined}
        />
      );
    case "date":
      return (
        <EntryDate
          {...shared}
          defaultValue={value instanceof Date ? value : undefined}
        />
      );
    case "time":
      return (
        <EntryTime
          {...shared}
          defaultValue={value instanceof Date ? value : undefined}
        />
      );
    case "media":
      return <EntryMedia {...shared} />;
    case "location":
      return <EntryLocation {...shared} />;
  }
}
