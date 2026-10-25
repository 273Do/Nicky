import { ComponentProps } from "react";
import { PlatformColor } from "react-native";

import { HStack, Image, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, frame, padding } from "@expo/ui/swift-ui/modifiers";

type Props = {
  /** SF Symbol の名前 */
  systemName: ComponentProps<typeof Image>["systemName"];
  /** 特典のタイトル */
  title: string;
  /** 特典の説明 */
  description: string;
};

/**
 * ペイウォールの特典 1 件を表示する行
 */
export function PaywallFeatureRow({ systemName, title, description }: Props) {
  return (
    <HStack alignment="top" modifiers={[padding({ bottom: 20 })]}>
      <Image
        systemName={systemName}
        modifiers={[
          foregroundStyle({ type: "color", color: PlatformColor("systemIndigo") }),
          font({ size: 24 }),
          frame({ width: 36, height: 36 }),
        ]}
      />
      <VStack alignment="leading" modifiers={[padding({ leading: 12 })]}>
        <Text modifiers={[font({ size: 17, weight: "semibold" }), padding({ bottom: 2 })]}>
          {title}
        </Text>
        <Text
          modifiers={[
            foregroundStyle({ type: "color", color: PlatformColor("secondaryLabel") }),
            font({ size: 15 }),
          ]}
        >
          {description}
        </Text>
      </VStack>
    </HStack>
  );
}
