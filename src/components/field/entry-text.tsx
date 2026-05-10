import { Text, TextField, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";

import { FIELD_LABELS } from "@/core/constants";

type Props = {
  /** フィールドラベル */
  label: string;
  /** デフォルト値 */
  defaultValue?: string;
  /** 値変更時のコールバック */
  onValueChange?: (value: string) => void | Promise<void>;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * テキストフィールド
 */
export function EntryText({
  label,
  defaultValue = "",
  onValueChange,
  edit = false,
}: Props) {
  return (
    <VStack alignment="leading" spacing={4}>
      <Text
        modifiers={[
          font({ size: 14, weight: "bold" }),
          foregroundStyle({
            type: "hierarchical",
            style: "secondary",
          }),
        ]}
      >
        {label}
      </Text>
      {edit ? (
        <TextField
          placeholder={FIELD_LABELS.text}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          modifiers={[frame({ maxWidth: 9999 })]}
        />
      ) : (
        <Text>{defaultValue}</Text>
      )}
    </VStack>
  );
}
