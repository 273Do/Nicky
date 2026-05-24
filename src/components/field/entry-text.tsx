import { Text, TextField } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

import { FIELD_LABELS } from "@/core/constants";

import { FieldWrapper } from "./field-wrapper";

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
    <FieldWrapper label={label}>
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
    </FieldWrapper>
  );
}
