import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { Button, ContextMenu, HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import { font, foregroundStyle, lineLimit } from "@expo/ui/swift-ui/modifiers";
import { useRouter } from "expo-router";

import { bookmarkEntry, deleteEntry } from "@/db/queries/entries";
import { formatDate } from "@/utils/date";
import { PreviewEntryObj } from "@/utils/entry/preview";

export const secondary = foregroundStyle({ type: "hierarchical", style: "secondary" });

type Props = {
  /** ジャーナル */
  journalName: string;
  /** エントリーデータ */
  entry: PreviewEntryObj;
};

/**
 * エントリー行
 */
export function EntryRow({ journalName, entry }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <Button
          modifiers={[foregroundStyle({ type: "hierarchical", style: "primary" })]}
          onPress={() => router.push(`/(journal)/entry/${entry.id}?journalName=${journalName}`)}
        >
          <VStack alignment="leading" spacing={2}>
            <HStack alignment="center" spacing={6}>
              <Text modifiers={[font({ size: 18, weight: "bold" }), lineLimit(1)]}>
                {entry.title}
              </Text>
              <Spacer />
              {entry.bookmark && (
                <Image systemName="bookmark.fill" size={14} color={PlatformColor("systemIndigo")} />
              )}
            </HStack>
            <Text modifiers={[font({ size: 14 }), secondary, lineLimit(1)]}>{entry.preview}</Text>
            <Text modifiers={[font({ size: 13 }), secondary]}>{formatDate(entry.createdAt)}</Text>
          </VStack>
        </Button>
      </ContextMenu.Trigger>
      <ContextMenu.Items>
        <Button
          label={entry.bookmark ? t("entry.unbookmark") : t("entry.bookmark")}
          systemImage={entry.bookmark ? "bookmark" : "bookmark.fill"}
          onPress={async () => await bookmarkEntry(entry.id, !entry.bookmark)}
        />
        <Button
          label={t("common.edit")}
          systemImage="ellipsis.circle"
          onPress={() =>
            router.push(`/(journal)/entry/${entry.id}?journalName=${journalName}&edit=true`)
          }
        />
        <Button
          label={t("common.delete")}
          systemImage="trash"
          role="destructive"
          onPress={async () => await deleteEntry(entry.id)}
        />
      </ContextMenu.Items>
    </ContextMenu>
  );
}
