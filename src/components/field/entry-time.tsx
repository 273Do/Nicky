import { useState } from "react";

import { DatePicker, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import { FIELD_LABELS } from "@/core/constants";
import { formatTime } from "@/utils/date";

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
    <VStack alignment="leading" spacing={4}>
      <Text
        modifiers={[
          font({ size: 14, weight: "bold" }),
          foregroundStyle({ type: "hierarchical", style: "secondary" }),
        ]}
      >
        {label}
      </Text>
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
    </VStack>
  );
}
