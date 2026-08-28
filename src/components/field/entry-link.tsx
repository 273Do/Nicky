import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native-reanimated";

import { Link, Text, TextField } from "@expo/ui/swift-ui";
import { disabled, foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";

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

const isUrl = (value: string) => /^https?:\/\/.+/.test(value);

/**
 * リンクフィールド
 */
export function EntryLink({ label, defaultValue = "", onValueChange, edit = false }: Props) {
  const { t } = useTranslation();

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <TextField
          placeholder={t("field.link")}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          modifiers={[frame({ maxWidth: 9999 })]}
        />
      ) : (
        <Link
          destination={defaultValue}
          modifiers={[disabled(!defaultValue || !isUrl(defaultValue))]}
        >
          <Text
            modifiers={[
              foregroundStyle(
                PlatformColor(
                  defaultValue && isUrl(defaultValue) ? "systemIndigo" : "tertiaryLabel",
                ),
              ),
            ]}
          >
            {defaultValue || t("field.notSet")}
          </Text>
        </Link>
      )}
    </FieldWrapper>
  );
}
