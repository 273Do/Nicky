import { EntryNumber } from "@/components/field/emtry-number";
import { EntryCheck } from "@/components/field/entry-check";
import { EntryDate } from "@/components/field/entry-date";
import { EntryLocation } from "@/components/field/entry-location";
import { EntryLongText } from "@/components/field/entry-long-text";
import { EntryMedia } from "@/components/field/entry-media";
import { EntryText } from "@/components/field/entry-text";
import { EntryTime } from "@/components/field/entry-time";
import type { FieldlObj } from "@/db/schemas";
import { type FieldValue } from "@/utils/journal/use-entry";

/**
 * フィールドタイプによってコンポーネントを返す関数
 * @param field フィールド
 * @param value 現在のフィールドの値
 * @param setValue フィールドに値を格納する関数
 */
export const renderField = (
  field: FieldlObj,
  value: FieldValue,
  setValue: (id: string, value: FieldValue) => void,
): React.JSX.Element => {
  const shared = {
    label: field.label,
    onValueChange: <T extends FieldValue>(v: T) => setValue(field.id, v),
    edit: true,
  };

  switch (field.type) {
    case "text":
      return (
        <EntryText key={field.id} {...shared} defaultValue={value as string} />
      );
    case "longText":
      return (
        <EntryLongText
          key={field.id}
          {...shared}
          defaultValue={value as string}
        />
      );
    case "number":
      return (
        <EntryNumber
          key={field.id}
          {...shared}
          defaultValue={(value ?? 0) as number}
        />
      );
    case "check":
      return (
        <EntryCheck
          key={field.id}
          {...shared}
          defaultValue={value as boolean}
        />
      );
    case "date":
      return (
        <EntryDate key={field.id} {...shared} defaultValue={value as Date} />
      );
    case "time":
      return (
        <EntryTime key={field.id} {...shared} defaultValue={value as Date} />
      );
    case "media":
      return <EntryMedia key={field.id} {...shared} />;
    case "location":
      return <EntryLocation key={field.id} {...shared} />;
  }
};
