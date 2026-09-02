import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Text, TextField, type TextFieldRef } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

import { cleanNumericInput } from "@/utils/entry/field-value";

import { FieldWrapper } from "./field-wrapper";

type Props = {
  /** フィールドラベル */
  label: string;
  /** デフォルト値 */
  defaultValue?: number;
  /** 値変更時のコールバック */
  onValueChange?: (value: number) => void | Promise<void>;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * 数値フィールド
 */
export function EntryNumber({ label, defaultValue, onValueChange, edit = false }: Props) {
  const { t } = useTranslation();
  const [number, setNumber] = useState<number | undefined>(defaultValue);
  const numberFieldRef = useRef<TextFieldRef>(null);

  /**
   * 値が変更された時に発火する関数
   * @param v 数値
   */
  const handleValueChange = async (v: string) => {
    const cleaned = cleanNumericInput(v);

    if (cleaned !== v) await numberFieldRef.current?.setText(cleaned);

    const parsed = cleaned === "" || cleaned === "." || cleaned === "-" ? 0 : parseFloat(cleaned);

    setNumber(parsed);
    await onValueChange?.(parsed);
  };

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <TextField
          ref={numberFieldRef}
          placeholder={t("field.number")}
          defaultValue={String(number ?? "")}
          onValueChange={handleValueChange}
          modifiers={[frame({ maxWidth: 9999 })]}
        />
      ) : (
        <Text>{number ?? ""}</Text>
      )}
    </FieldWrapper>
  );
}
