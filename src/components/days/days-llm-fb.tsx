import { useEffect, useState } from "react";
import { PlatformColor } from "react-native";

import { Button, HStack, Image, Section, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import { ReflectionCategory } from "@/constants/reflection-category";
import { DailyEntryObj } from "@/db/queries/entries";
import { getReflectionCategory } from "@/utils/days/reflection/get-reflection-category";
import { getReflectionContent } from "@/utils/days/reflection/get-reflection-content";

import { FieldWrapper } from "../field/field-wrapper";

type Props = {
  /**
   * 日毎のエントリー
   */
  entries: DailyEntryObj[];
};

type ReflectionObj = {
  category: ReflectionCategory;
  content: string;
};

/**
 * LLM によるフィードバックを表示する
 */
export function DaysLLMFB({ entries }: Props) {
  const [reflections, setReflections] = useState<[ReflectionObj, ReflectionObj] | null>();

  useEffect(() => {
    setReflections(null);
  }, [entries]);

  const handleGenerateReflection = async () => {
    console.log("click");
    const categories = await getReflectionCategory(entries);

    if (categories && categories.length === 2) {
      const [content0, content1] = await Promise.all([
        getReflectionContent(entries, categories[0]),
        getReflectionContent(entries, categories[1]),
      ]);

      setReflections([
        { category: categories[0], content: content0 ?? "" },
        { category: categories[1], content: content1 ?? "" },
      ]);
      console.log(reflections);
    }
  };

  return (
    <>
      <Button label={"Gen"} onPress={handleGenerateReflection} />
      {reflections && (
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
              </HStack>
            </HStack>
          }
        >
          {reflections.map(({ category, content }, i) => (
            <FieldWrapper label={category} key={i}>
              <Text>{content}</Text>
            </FieldWrapper>
          ))}
        </Section>
      )}
    </>
  );
}
