import { PlatformColor, useWindowDimensions } from "react-native";

import { HStack, Image, ScrollView, Spacer, Text } from "@expo/ui/swift-ui";
import {
  animation,
  Animation,
  defaultScrollAnchor,
  fixedSize,
  font,
  foregroundStyle,
  glassEffect,
  listRowInsets,
  onTapGesture,
  padding,
  scrollDisabled,
} from "@expo/ui/swift-ui/modifiers";

import { JournalWithCountObj } from "@/db/queries/journals";

const CHIP_H_PAD = 10;
const CHIP_ICON = 14;
const CHIP_GAP = 4;
const CHIP_SPACING = 8;
const LIST_H_PAD = 16;
const AVG_CHAR_W = 9;

/** チップ全体の推定幅 */
const estimateWidth = (journals: JournalWithCountObj[]) => {
  const chips = journals.reduce(
    (s, j) => s + CHIP_H_PAD * 2 + CHIP_ICON + CHIP_GAP + j.name.length * AVG_CHAR_W,
    0,
  );
  return LIST_H_PAD * 2 + chips + Math.max(0, journals.length - 1) * CHIP_SPACING;
};

const chipBase = [padding({ vertical: 6, horizontal: CHIP_H_PAD }), font({ size: 14 })];

const glassInactive = glassEffect({
  glass: { variant: "regular", interactive: true },
  shape: "capsule",
});

const glassActive = (color: string) =>
  glassEffect({
    glass: {
      variant: "regular",
      interactive: true,
      tint: color,
    },
    shape: "capsule",
  });

type Props = {
  /** ジャーナル */
  journals: JournalWithCountObj[];
  /** 表示するジャーナルのid */
  activeJournalId: string;
  /** 表示するジャーナルをセットする関数 */
  onSelect: (id: string) => void;
  /** 初期表示時に末尾へスクロール */
  scrollToEnd?: boolean;
};

/**
 * 表示するジャーナルの統計を選択するチップ
 */
export function JournalChipList({ journals, activeJournalId, onSelect, scrollToEnd }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const fitsOnScreen = estimateWidth(journals) <= screenWidth;

  return (
    <ScrollView
      axes="horizontal"
      showsIndicators={false}
      modifiers={[
        scrollDisabled(fitsOnScreen),
        ...(scrollToEnd && !fitsOnScreen ? [defaultScrollAnchor("trailing")] : []),
        padding({ top: -32, bottom: -32 }),
        listRowInsets({
          leading: 0.1,
          trailing: 0.1,
          top: 0,
          bottom: 16,
        }),
      ]}
    >
      <HStack
        spacing={CHIP_SPACING}
        modifiers={[
          padding({ leading: LIST_H_PAD, trailing: LIST_H_PAD, top: 32, bottom: 32 }),
          fixedSize({ horizontal: true, vertical: false }),
        ]}
      >
        {journals.map((journal) => {
          const isActive = journal.id === activeJournalId;
          return (
            <HStack
              key={journal.id}
              modifiers={[
                ...chipBase,
                foregroundStyle(isActive ? "white" : PlatformColor("systemGray")),
                animation(Animation.easeInOut({ duration: 0.2 }), isActive),
                isActive ? glassActive(journal.color) : glassInactive,
                onTapGesture(() => onSelect(journal.id)),
              ]}
            >
              <Image
                systemName={journal.icon}
                color={isActive ? PlatformColor("white") : PlatformColor("systemGray")}
                size={CHIP_ICON}
              />
              <Spacer minLength={CHIP_GAP} />
              <Text>{journal.name}</Text>
            </HStack>
          );
        })}
      </HStack>
    </ScrollView>
  );
}
