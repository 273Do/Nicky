import { useTranslation } from "react-i18next";

import { Text, TextField, useNativeState } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

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
export function EntryText({ label, defaultValue = "", onValueChange, edit = false }: Props) {
  const { t } = useTranslation();
  const text = useNativeState(defaultValue);

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <TextField
          text={text}
          placeholder={t("field.text")}
          onTextChange={onValueChange}
          modifiers={[frame({ maxWidth: 9999 })]}
        />
      ) : (
        <Text>{defaultValue}</Text>
      )}
    </FieldWrapper>
  );
}
