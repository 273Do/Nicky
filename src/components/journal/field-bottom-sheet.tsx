import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { BottomSheet, Button, Group, HStack, Image, List, Text } from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  frame,
  padding,
  presentationDetents,
  presentationDragIndicator,
  scrollDisabled,
} from "@expo/ui/swift-ui/modifiers";

import { FIELD_ICONS, FIELD_LABEL_KEYS, FieldType } from "@/constants/journal";
import { FIELD_TYPES } from "@/hooks/journal/use-journal-field";

type Props = {
  /** ボトムシートの表示状態 */
  isPresented: boolean;
  /** 表示状態の変更コールバック */
  onIsPresentedChange: (value: boolean) => void;
  /** フィールド追加時のコールバック */
  onAdd: (type: FieldType) => void;
};

/**
 * フィールド追加ボトムシート
 */
export function FieldBottomSheet({ isPresented, onIsPresentedChange, onAdd }: Props) {
  const { t } = useTranslation();
  const handlePress = (type: FieldType) => {
    onAdd(type);
  };

  return (
    <BottomSheet isPresented={isPresented} onIsPresentedChange={onIsPresentedChange}>
      <Group
        modifiers={[
          presentationDetents([{ height: FIELD_TYPES.length * 54 + 12 }]),
          padding({ horizontal: 8, top: -8 }),
          presentationDragIndicator("visible"),
        ]}
      >
        <List modifiers={[scrollDisabled()]}>
          {FIELD_TYPES.map((type) => (
            <Button
              key={type}
              modifiers={[foregroundStyle({ type: "hierarchical", style: "primary" })]}
              onPress={() => handlePress(type)}
            >
              <HStack spacing={12}>
                <Image
                  systemName={FIELD_ICONS[type]}
                  color={PlatformColor("systemIndigo")}
                  size={20}
                  modifiers={[frame({ width: 24 })]}
                />
                <Text>{t(FIELD_LABEL_KEYS[type])}</Text>
              </HStack>
            </Button>
          ))}
        </List>
      </Group>
    </BottomSheet>
  );
}
