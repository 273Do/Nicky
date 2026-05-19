import { PlatformColor } from "react-native";

import { HStack, Image, ScrollView, Spacer, Text } from "@expo/ui/swift-ui";
import {
  Animation,
  animation,
  fixedSize,
  font,
  foregroundStyle,
  glassEffect,
  onTapGesture,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import { JournalWithCountObj } from "@/db/queries/journals";

const chipBase = [padding({ vertical: 6, horizontal: 10 }), font({ size: 14 })];

const glassLabel = [
  ...chipBase,
  glassEffect({
    glass: { variant: "regular", interactive: true },
    shape: "roundedRectangle",
    cornerRadius: 100,
  }),
  foregroundStyle({ type: "hierarchical", style: "secondary" }),
];

const activeLabel = (color: string) => [
  ...chipBase,
  glassEffect({
    glass: {
      variant: "regular",
      interactive: true,
      tint: color,
    },
    shape: "roundedRectangle",
    cornerRadius: 100,
  }),
  foregroundStyle("white"),
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
export function JournalChipList({
  journals,
  activeJournalId,
  onSelect,
}: Props) {
  return (
    <ScrollView axes="horizontal" showsIndicators={false}>
      <HStack
        spacing={8}
        modifiers={[
          padding({ leading: 16, vertical: 32 }),
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
                animation(Animation.easeInOut({ duration: 0.3 }), isActive),
                onTapGesture(() => onSelect(journal.id)),
              ]}
            >
              <Image
                systemName={journal.icon}
                color={
                  isActive
                    ? PlatformColor("white")
                    : PlatformColor("systemGray")
                }
                size={14}
              />
              <Spacer minLength={3} />
              <Text>{journal.name}</Text>
            </HStack>
          );
        })}
      </HStack>
    </ScrollView>
  );
}
