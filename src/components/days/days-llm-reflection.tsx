import { PlatformColor } from "react-native";

import { Button, HStack, Image, Section, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import type { DailyEntryObj } from "@/db/queries/entries";
import { getReflectionByDateQuery, storeReflection } from "@/db/queries/reflections";
import { getReflection } from "@/utils/days/reflection/get-reflection";
import { useAIReflectionSettings } from "@/utils/settings/use-ai-reflection-settings";

import { FieldWrapper } from "../field/field-wrapper";

type Props = {
  /** 表示対象の日付 */
  date: Date;
  /** 日毎のエントリー */
  entries: DailyEntryObj[];
};

/**
 * AI Reflection を表示する
 */
export function DaysLLMReflection({ date, entries }: Props) {
  const { aiReflectionEnabled, aiModel } = useAIReflectionSettings();
  const { data: reflection } = useLiveQuery(getReflectionByDateQuery(date), [date.getTime()]);

  if (!aiReflectionEnabled) return null;

  const handleGenerate = async () => {
    const result = await getReflection(entries, aiModel.gguf);
    if (result) {
      await storeReflection(date, result);
    }
  };

  if (reflection) {
    return (
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
        <FieldWrapper label={reflection.firstCategory}>
          <Text>{reflection.firstContent}</Text>
        </FieldWrapper>
        <FieldWrapper label={reflection.secondCategory}>
          <Text>{reflection.secondContent}</Text>
        </FieldWrapper>
      </Section>
    );
  }

  return <Button label="Gen" onPress={handleGenerate} />;
}
