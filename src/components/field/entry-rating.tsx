import { useState } from "react";
import { useTranslation } from "react-i18next";

import { HStack, ProgressView, Slider, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { frame } from "@expo/ui/swift-ui/modifiers";

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
 * レーティングフィールド
 */
export function EntryRating({ label, defaultValue = 0, onValueChange, edit = false }: Props) {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(defaultValue);

  const handleValueChange = async (v: number | string) => {
    const rounded = Math.round(Number(v));
    setValue(rounded);
    await onValueChange?.(rounded);
  };

  return (
    <FieldWrapper label={label}>
      {edit ? (
        <VStack>
          <HStack>
            <Spacer modifiers={[frame({ maxWidth: value * 3 })]} />
            <Text>{value}</Text>
            <Spacer modifiers={[frame({ maxWidth: (100 - value) * 3 })]} />
          </HStack>
          <Spacer />
          <Slider
            label={<Text>{t("field.rating")}</Text>}
            value={value}
            min={0}
            max={100}
            minimumValueLabel={<Text>0</Text>}
            maximumValueLabel={<Text>100</Text>}
            onValueChange={handleValueChange}
          />
        </VStack>
      ) : (
        <VStack>
          <HStack>
            <Spacer modifiers={[frame({ maxWidth: defaultValue * 3 })]} />
            <Text>{defaultValue}</Text>
            <Spacer modifiers={[frame({ maxWidth: (100 - defaultValue) * 3 })]} />
          </HStack>
          <Spacer />
          <HStack>
            <Text>0</Text>
            <Spacer />
            <ProgressView value={defaultValue / 100} />
            <Spacer />
            <Text>100</Text>
          </HStack>
        </VStack>
      )}
    </FieldWrapper>
  );
}
