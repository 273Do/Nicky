import { PlatformColor } from "react-native";

import { HStack, Image, ScrollView, Spacer, Text } from "@expo/ui/swift-ui";
import {
  fixedSize,
  font,
  foregroundStyle,
  glassEffect,
  listRowInsets,
  onTapGesture,
  padding,
  shadow,
} from "@expo/ui/swift-ui/modifiers";

import { JournalWithCountObj } from "@/db/queries/journals";

const chipBase = [padding({ vertical: 6, horizontal: 10 }), font({ size: 14 })];

const chipShadow = shadow({ radius: 20, color: "#00000020" });

const glassLabel = [
  ...chipBase,
  glassEffect({
    glass: { variant: "clear", interactive: true },
    shape: "roundedRectangle",
    cornerRadius: 100,
  }),
  foregroundStyle(PlatformColor("systemGray")),
  chipShadow,
];

const activeLabel = (color: string) => [
  ...chipBase,
  glassEffect({
    glass: {
      variant: "clear",
      interactive: true,
      tint: color,
    },
    shape: "roundedRectangle",
    cornerRadius: 100,
  }),
  foregroundStyle("white"),
  chipShadow,
];

type Props = {
  /** ジャーナル */
  journals: JournalWithCountObj[];
  /** 表示するジャーナルのid */
  activeJournalId: string;
  /** 表示するジャーナルをセットする関数 */
  onSelect: (id: string) => void;
};

/**
 * 表示するジャーナルの統計を選択するチップ
 */
export function JournalChipList({ journals, activeJournalId, onSelect }: Props) {
  return (
    <ScrollView
      axes="horizontal"
      showsIndicators={false}
      modifiers={[
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
        spacing={8}
        modifiers={[
          padding({ leading: 16, trailing: 16, top: 32, bottom: 32 }),
          fixedSize({ horizontal: true, vertical: false }),
        ]}
      >
        {journals.map((journal) => {
          const isActive = journal.id === activeJournalId;
          return (
            <HStack
              key={journal.id}
              modifiers={[
                ...(isActive ? activeLabel(journal.color) : glassLabel),
                // animation(Animation.easeInOut({ duration: 0.3 }), isActive),
                onTapGesture(() => onSelect(journal.id)),
              ]}
            >
              <Image
                systemName={journal.icon}
                color={isActive ? PlatformColor("white") : PlatformColor("systemGray")}
                size={14}
              />
              <Spacer minLength={4} />
              <Text>{journal.name}</Text>
            </HStack>
          );
        })}
      </HStack>
    </ScrollView>
  );
}
