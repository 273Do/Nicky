import {
  Button,
  ContextMenu,
  Image,
  RoundedRectangle,
  Text,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  clipShape,
  font,
  foregroundStyle,
  frame,
  onTapGesture,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";

import { deleteJournal, JournalWithCountObj } from "@/db/queries/journals";

type Props = {
  /** ジャーナルデータ */
  journal: JournalWithCountObj;
};

function lightenColor(hex: string, amount = 40): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

/**
 * ジャーナルカード
 */
export function JournalCard({ journal }: Props) {
  const router = useRouter();

  const { id: journalId, name, icon, color, entryCount } = journal;

  return (
    <ZStack modifiers={[frame({ height: 85 })]}>
      <ContextMenu>
        <ContextMenu.Trigger>
          <ZStack
            alignment="bottomLeading"
            modifiers={[
              frame({ height: 85 }),
              clipShape("roundedRectangle", 20),
              onTapGesture(() =>
                router.push(`/(journal)/${journalId}?name=${name}`),
              ),
            ]}
          >
            <RoundedRectangle
              cornerRadius={20}
              modifiers={[
                frame({ maxWidth: 9999, maxHeight: 9999 }),
                foregroundStyle({
                  type: "linearGradient",
                  colors: [lightenColor(color), color],
                  startPoint: { x: 0, y: 0 },
                  endPoint: { x: 0, y: 1 },
                }),
              ]}
            />
            <Image
              systemName={icon}
              color="white"
              size={24}
              modifiers={[
                frame({
                  maxWidth: 9999,
                  maxHeight: 9999,
                  alignment: "topLeading",
                }),
                padding({ all: 14 }),
              ]}
            />
            <Text
              modifiers={[
                frame({
                  maxWidth: 9999,
                  maxHeight: 9999,
                  alignment: "topTrailing",
                }),
                padding({ top: 14, trailing: 14 }),
                font({ size: 24, weight: "bold" }),
                foregroundStyle("white"),
              ]}
            >
              {entryCount}
            </Text>
            <Text
              modifiers={[
                padding({ leading: 14, bottom: 12 }),
                font({ size: 15, weight: "semibold" }),
                foregroundStyle("white"),
              ]}
            >
              {name}
            </Text>
          </ZStack>
        </ContextMenu.Trigger>
        <ContextMenu.Items>
          <Button label="Edit" systemImage="pencil" onPress={() => {}} />
          <Button
            label="Delete"
            systemImage="trash"
            role="destructive"
            onPress={async () => await deleteJournal(journalId)}
          />
        </ContextMenu.Items>
      </ContextMenu>
    </ZStack>
  );
}
