import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { BottomSheet, Button, Group, HStack, Image, Label, List, Spacer } from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  padding,
  presentationDetents,
  presentationDragIndicator,
  scrollDisabled,
} from "@expo/ui/swift-ui/modifiers";

import { FIELD_ICONS, FIELD_LABEL_KEYS, FieldType } from "@/constants/journal";
import { PRO_FIELD_TYPES } from "@/constants/purchases";
import { FIELD_TYPES } from "@/hooks/journal/use-journal-field";

type Props = {
  /** ボトムシートの表示状態 */
  isPresented: boolean;
  /** 表示状態の変更コールバック */
  onIsPresentedChange: (value: boolean) => void;
  /** フィールド追加時のコールバック */
  onAdd: (type: FieldType) => void;
  /** Pro が有効かどうか */
  isPro: boolean;
  /** Pro 限定フィールドが選ばれたときのコールバック */
  onRequirePro: () => void;
};

/**
 * フィールド追加ボトムシート
 *
 * Pro 限定のフィールドは鍵付きで表示し、タップでペイウォールへ誘導する。
 */
export function FieldBottomSheet({
  isPresented,
  onIsPresentedChange,
  onAdd,
  isPro,
  onRequirePro,
}: Props) {
  const { t } = useTranslation();

  const handlePress = (type: FieldType) => {
    if (!isPro && PRO_FIELD_TYPES.includes(type)) {
      onIsPresentedChange(false);
      onRequirePro();
      return;
    }
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
          {FIELD_TYPES.map((type) => {
            const requiresPro = !isPro && PRO_FIELD_TYPES.includes(type);

            return (
              <Button
                key={type}
                modifiers={[foregroundStyle({ type: "hierarchical", style: "primary" })]}
                onPress={() => handlePress(type)}
              >
                <HStack>
                  <Label
                    title={t(FIELD_LABEL_KEYS[type])}
                    icon={
                      <Image
                        systemName={FIELD_ICONS[type]}
                        color={PlatformColor("systemIndigo")}
                        size={17}
                      />
                    }
                  />
                  <Spacer />
                  {requiresPro && (
                    <Image
                      systemName="lock.fill"
                      color={PlatformColor("secondaryLabel")}
                      size={15}
                    />
                  )}
                </HStack>
              </Button>
            );
          })}
        </List>
      </Group>
    </BottomSheet>
  );
}
