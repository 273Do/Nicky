import { useTranslation } from "react-i18next";

import { Text, TextField } from "@expo/ui/swift-ui";
import { frame, lineLimit } from "@expo/ui/swift-ui/modifiers";

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
 * ロングテキストフィールド
 */
export function EntryLongText({ label, defaultValue = "", onValueChange, edit = false }: Props) {
  const { t } = useTranslation();

  // TODO: md対応
  return (
    <FieldWrapper label={label}>
      {edit ? (
        <TextField
          placeholder={t("field.longText")}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          axis="vertical"
          modifiers={[
            frame({ maxWidth: 9999, minHeight: 120, alignment: "topLeading" }),
            lineLimit(),
          ]}
        />
      ) : (
        <Text>{defaultValue}</Text>
      )}
    </FieldWrapper>
  );
}
