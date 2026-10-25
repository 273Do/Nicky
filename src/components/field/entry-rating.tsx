import { useState } from "react";
import { useTranslation } from "react-i18next";

import { HStack, ProgressView, Slider, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

import { FieldWrapper } from "./field-wrapper";

type Props = {
  /** フィールドラベル */
  label: string;
  /** 最小値 */
  min?: number;
  /** 最大値 */
  max?: number;
  /** デフォルト値 */
  defaultValue?: number;
  /** 値変更時のコールバック */
  onValueChange?: (value: number) => void | Promise<void>;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * レーティングフィールド
 */
export function EntryRating({
  label,
  min = 0,
  max = 100,
  defaultValue = 0,
  onValueChange,
  edit = false,
}: Props) {
  const { t } = useTranslation();
  const range = max - min || 1;
  const [value, setValue] = useState<number>(defaultValue);

  const handleValueChange = async (v: number | string) => {
    const rounded = Math.round(Number(v) * 10) / 10;
    setValue(rounded);
    await onValueChange?.(rounded);
  };

  const ratio = (v: number) => Math.min(1, Math.max(0, (v - min) / range));

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <VStack>
          <HStack>
            <Spacer modifiers={[frame({ maxWidth: ratio(value) * 300 })]} />
            <Text>{value}</Text>
            <Spacer modifiers={[frame({ maxWidth: (1 - ratio(value)) * 300 })]} />
          </HStack>
          <Spacer />
          <Slider
            label={<Text>{t("field.rating")}</Text>}
            value={value}
            min={min}
            max={max}
            minimumValueLabel={<Text>{min}</Text>}
            maximumValueLabel={<Text>{max}</Text>}
            onValueChange={handleValueChange}
          />
        </VStack>
      ) : (
        <VStack>
          <HStack>
            <Spacer modifiers={[frame({ maxWidth: ratio(defaultValue) * 300 })]} />
            <Text>{defaultValue}</Text>
            <Spacer modifiers={[frame({ maxWidth: (1 - ratio(defaultValue)) * 300 })]} />
          </HStack>
          <Spacer />
          <HStack>
            <Text>{min}</Text>
            <Spacer />
            <ProgressView value={ratio(defaultValue)} />
            <Spacer />
            <Text>{max}</Text>
          </HStack>
        </VStack>
      )}
    </FieldWrapper>
  );
}
