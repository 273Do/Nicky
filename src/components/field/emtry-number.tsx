import { useRef, useState } from "react";

import { Text, TextField, type TextFieldRef } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

import { FIELD_LABELS } from "@/core/constants";

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
  const [number, setNumber] = useState<number | undefined>(defaultValue);
  const numberFieldRef = useRef<TextFieldRef>(null);

  /**
   * 値が変更された時に発火する関数
   * @param v 数値
   */
  const handleValueChange = (v: string) => {
    const cleaned = v.replace(/[^0-9.]/g, "").replace(/^(\d*\.?\d*).*/, "$1");

    if (cleaned !== v) numberFieldRef.current?.setText(cleaned);

    const parsed = cleaned === "" || cleaned === "." ? 0 : parseFloat(cleaned);

    setNumber(parsed);
    onValueChange?.(parsed);
  };

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <TextField
          ref={numberFieldRef}
          placeholder={FIELD_LABELS.number}
          defaultValue={String(number ?? "")}
          onValueChange={handleValueChange}
          modifiers={[frame({ maxWidth: 9999 })]}
        />
      ) : (
        <Text>{String(number ?? "")}</Text>
      )}
    </FieldWrapper>
  );
}
