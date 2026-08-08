import { PlatformColor } from "react-native";

import { HStack, Image, Section, Text } from "@expo/ui/swift-ui";
import { font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

import { FieldWrapper } from "../field/field-wrapper";

/**
 * LLM によるフィードバックを表示する
 */
export function DaysLLMFB() {
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
              今日の気付き
            </Text>
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
