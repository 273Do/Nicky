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
import { lightenColor } from "@/utils/journal/color";

type Props = {
  /** ジャーナルデータ */
  journal: JournalWithCountObj;
};

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
          <Button
            label="Edit"
            systemImage="ellipsis.circle"
            onPress={() => {}}
          />
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
