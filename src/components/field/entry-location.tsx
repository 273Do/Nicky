import { useTranslation } from "react-i18next";
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
 * 位置情報フィールド（ダミー実装）
 */
export function EntryLocation({ label, edit = false }: Props) {
  const { t } = useTranslation();

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
          <Text>{t("field.location")}</Text>
          <Spacer />
          <Button
            modifiers={[
              foregroundStyle({ type: "hierarchical", style: "primary" }),
              buttonStyle("bordered"),
            ]}
            onPress={() => {}}
          >
            <HStack spacing={6}>
              <Image
                systemName="mappin.and.ellipse"
                color={PlatformColor("systemIndigo")}
                size={18}
              />
              <Text>{t("field.setLocation")}</Text>
            </HStack>
          </Button>
        </HStack>
      ) : (
        <HStack spacing={6}>
          <Image systemName="mappin.and.ellipse" color={PlatformColor("tertiaryLabel")} size={16} />
          <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "tertiary" })]}>
            {t("field.notSet")}
          </Text>
        </HStack>
      )}
    </VStack>
  );
}
