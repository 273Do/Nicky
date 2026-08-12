import { PlatformColor } from "react-native";

import { Button, HStack, Image, Section, Spacer, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import { DailyEntryObj } from "@/db/queries/entries";
import { getReflectionCategory } from "@/utils/days/reflection/get-reflection-category";

import { FieldWrapper } from "../field/field-wrapper";

type Props = {
  /**
   * 日毎のエントリー
   */
  entries: DailyEntryObj[];
};

/**
 * LLM によるフィードバックを表示する
 */
export function DaysLLMFB({ entries }: Props) {
  const handleGenerateReflection = async () => {
    const result = await getReflectionCategory(entries);
    console.log(result);
  };

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
              {`Today's reflection`}
            </Text>

            <Spacer />
            <Button label={"Gen"} onPress={handleGenerateReflection} />
          </HStack>
        </HStack>
      }
    >
      <FieldWrapper label={"hoge"}>
        <Text>hogehoge</Text>
      </FieldWrapper>
      <FieldWrapper label={"fuga"}>
        <Text>fugafuga</Text>
      </FieldWrapper>
    </Section>
  );
}
