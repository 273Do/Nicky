import { PlatformColor } from "react-native";

import { Button, HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { buttonStyle, font, foregroundStyle } from "@expo/ui/swift-ui/modifiers";

type Props = {
  /** フィールドラベル */
  label: string;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * メディアフィールド（ダミー実装）
 */
export function EntryMedia({ label, edit = false }: Props) {
  return (
    <VStack alignment="leading" spacing={8}>
      <Text
        modifiers={[
          font({ size: 14, weight: "bold" }),
          foregroundStyle({ type: "hierarchical", style: "secondary" }),
        ]}
      >
        {label}
      </Text>
      {edit ? (
        <HStack>
          <Text>Media</Text>
          <Spacer />
          <Button
            modifiers={[
              foregroundStyle({ type: "hierarchical", style: "primary" }),
              buttonStyle("bordered"),
            ]}
            onPress={() => {}}
          >
            <Image systemName="photo.badge.plus" color={PlatformColor("systemIndigo")} size={18} />
          </Button>
        </HStack>
      ) : (
        <Image systemName="photo" color={PlatformColor("tertiaryLabel")} size={40} />
      )}
    </VStack>
  );
}
