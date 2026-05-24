import { useState } from "react";

import { DatePicker, Text } from "@expo/ui/swift-ui";

import { FIELD_LABELS } from "@/core/constants";
import { formatTime } from "@/utils/date";

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
 * 時刻フィールド
 */
export function EntryTime({
  label,
  defaultValue = new Date(),
  onValueChange,
  edit = false,
}: Props) {
  const [time, setTime] = useState<Date>(defaultValue);

  const handleChange = (value: Date) => {
    setTime(value);
    onValueChange?.(value);
  };

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <DatePicker
          title={FIELD_LABELS.time}
          selection={time}
          displayedComponents={["hourAndMinute"]}
          onDateChange={handleChange}
        />
      ) : (
        <Text>{formatTime(time)}</Text>
      )}
    </FieldWrapper>
  );
}
