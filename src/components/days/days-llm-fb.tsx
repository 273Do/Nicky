import { useEffect, useState } from "react";
import { PlatformColor } from "react-native";

import { Button, HStack, Image, Section, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import type { ReflectionResult } from "@/constants/reflection";
import { DailyEntryObj } from "@/db/queries/entries";
import { getReflection } from "@/utils/days/reflection/get-reflection";

import { FieldWrapper } from "../field/field-wrapper";

type Props = {
  /**
   * 日毎のエントリー
   */
  entries: DailyEntryObj[];
};

/**
 * AI Reflection を表示する
 */
export function DaysLLMFB({ entries }: Props) {
  const [reflection, setReflection] = useState<ReflectionResult | null>();

  useEffect(() => {
    setReflection(null);
  }, [entries]);

  const handleGenerate = async () => {
    const result = await getReflection(entries);
    if (result) {
      setReflection(result);
    }
  };

  return (
    <>
      <Button label={"Gen"} onPress={handleGenerate} />
      {reflection && (
        <Section
          header={
            <HStack alignment="bottom">
              <HStack spacing={6}>
                <Image systemName={"sparkles"} color={PlatformColor("systemIndigo")} size={20} />
                <Text
                  modifiers={[
                    font({ size: 18, weight: "bold" }),
                    foregroundStyle(PlatformColor("label")),
                  ]}
                >
                  {reflection.title}
                </Text>
              </HStack>
            </HStack>
          }
        >
          {reflection.items.map(({ category, content }, i) => (
            <FieldWrapper label={category} key={i}>
              <Text>{content}</Text>
            </FieldWrapper>
          ))}
        </Section>
      )}
    </>
  );
}
