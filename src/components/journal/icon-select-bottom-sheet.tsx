import { PlatformColor } from "react-native";

import {
  BottomSheet,
  ColorPicker,
  Grid,
  Group,
  Image,
  RoundedRectangle,
  ScrollView,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  frame,
  onTapGesture,
  padding,
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";
import { SFSymbol } from "expo-symbols";

import { JOURNAL_ICONS } from "@/constants/journal";
import { chunkArray } from "@/utils/chunk-array";

type Props = {
  /** ボトムシートの表示状態 */
  isPresented: boolean;
  /** 表示状態の変更コールバック */
  onIsPresentedChange: (value: boolean) => void;
  /** 選択中のアイコン */
  selectedIcon: SFSymbol;
  /** 選択中のカラー */
  selectedColor: string;
  /** アイコン選択時のコールバック */
  onSelectIcon: (icon: SFSymbol) => void;
  /** カラー変更時のコールバック */
  onSelectColor: (color: string) => void;
};

/** 1行に表示するアイコン数 */
const COLUMNS = 6;

/**
 * アイコン・カラー選択ボトムシート
 */
export function IconSelectBottomSheet({
  isPresented,
  onIsPresentedChange,
  selectedIcon,
  selectedColor,
  onSelectIcon,
  onSelectColor,
}: Props) {
  const rows = chunkArray(JOURNAL_ICONS, COLUMNS);

  return (
    <BottomSheet isPresented={isPresented} onIsPresentedChange={onIsPresentedChange}>
      <Group modifiers={[presentationDetents(["medium"]), presentationDragIndicator("visible")]}>
        <ScrollView>
          {/* カラーピッカー */}
          <ZStack>
            <RoundedRectangle
              cornerRadius={100}
              modifiers={[
                frame({ maxWidth: 9999, height: 52 }),
                foregroundStyle(PlatformColor("secondarySystemFill")),
                padding({ horizontal: 24, top: 32 }),
              ]}
            />
            <ColorPicker
              label="Select folder color"
              selection={selectedColor}
              onSelectionChange={onSelectColor}
              supportsOpacity={false}
              modifiers={[padding({ horizontal: 42, top: 32 })]}
            />
          </ZStack>

          {/* アイコングリッド */}
          <Grid modifiers={[padding({ horizontal: 16, vertical: 8 })]}>
            {rows.map((row, rowIndex) => (
              <Grid.Row key={rowIndex}>
                {row.map((icon) => (
                  <ZStack
                    key={icon}
                    modifiers={[
                      frame({ width: 52, height: 52 }),
                      onTapGesture(() => {
                        onSelectIcon(icon);
                        onIsPresentedChange(false);
                      }),
                    ]}
                  >
                    <RoundedRectangle
                      cornerRadius={100}
                      modifiers={[
                        frame({ maxWidth: 9999, maxHeight: 9999 }),
                        foregroundStyle(
                          selectedIcon === icon
                            ? selectedColor
                            : PlatformColor("secondarySystemFill"),
                        ),
                      ]}
                    />
                    <Image
                      systemName={icon}
                      color={selectedIcon === icon ? "white" : PlatformColor("label")}
                      size={24}
                    />
                  </ZStack>
                ))}
              </Grid.Row>
            ))}
          </Grid>
        </ScrollView>
      </Group>
    </BottomSheet>
  );
}
