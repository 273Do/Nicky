import { useState } from "react";

import { DatePicker, Text } from "@expo/ui/swift-ui";

import { FIELD_LABELS } from "@/core/constants";
import { formatDate } from "@/utils/date";

import { FieldWrapper } from "./field-wrapper";

type Props = {
  /** フィールドラベル */
  label: string;
  /** デフォルト値 */
  defaultValue?: Date;
  /** 値変更時のコールバック */
  onValueChange?: (value: Date) => void | Promise<void>;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * 日付フィールド
 */
export function EntryDate({
  label,
  defaultValue = new Date(),
  onValueChange,
  edit = false,
}: Props) {
  const [date, setDate] = useState<Date>(defaultValue);

  const handleChange = (value: Date) => {
    setDate(value);
    onValueChange?.(value);
  };

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <DatePicker
          title={FIELD_LABELS.date}
          selection={date}
          displayedComponents={["date"]}
          onDateChange={handleChange}
        />
      ) : (
        <Text>{formatDate(date)}</Text>
      )}
    </FieldWrapper>
  );
}
