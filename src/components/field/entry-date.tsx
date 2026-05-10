import { useState } from "react";

import { DatePicker, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import { FIELD_LABELS } from "@/core/constants";
import { formatDate } from "@/utils/date";

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
  const [date, setDate] = useState(defaultValue);

  const handleChange = (value: Date) => {
    setDate(value);
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
          title={FIELD_LABELS.date}
          selection={date}
          displayedComponents={["date"]}
          onDateChange={handleChange}
        />
      ) : (
        <Text>{formatDate(date)}</Text>
      )}
    </VStack>
  );
}
