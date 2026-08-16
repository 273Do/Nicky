import { useState } from "react";
import { PlatformColor } from "react-native";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useRouter } from "expo-router";
import { z } from "zod";

import { EntryDetailView } from "@/components/entry/entry-detail";
import { EntryEditView } from "@/components/entry/entry-edit-view";
import { bookmarkEntry, deleteEntry, getEntryDetailQuery } from "@/db/queries/entries";
import { useValidatedParams } from "@/hooks/use-validated-params";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const router = useRouter();

  const shema = z.object({
    id: z.string(),
    journalName: z.string(),
    edit: z
      .string()
      .optional()
      .transform((v) => v === "true"),
  });
  const { id: entryId, journalName, edit } = useValidatedParams(shema);

  const [editMode, setEditMode] = useState(edit);
  const { data: entry } = useLiveQuery(getEntryDetailQuery(entryId), [entryId]);

  const handleDelete = async () => {
    await deleteEntry(entryId);
    router.back();
  };

  const handleBookmark = async () => {
    if (entry) await bookmarkEntry(entry.id, !entry.bookmark);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: journalName,
          headerLargeTitleEnabled: true,
          unstable_headerRightItems: editMode
            ? undefined
            : () => [
                {
                  type: "menu",
                  label: "Options",
                  icon: { type: "sfSymbol", name: "ellipsis" },
                  menu: {
                    items: [
                      {
                        type: "action",
                        icon: {
                          type: "sfSymbol",
                          name: "square.and.arrow.up",
                        },
                        label: "Export Entry",
                        onPress: () => console.log("Export Entry"),
                      },
                      {
                        type: "action",
                        label: "Delete Entry",
                        icon: { type: "sfSymbol", name: "trash" },
                        destructive: true,
                        onPress: handleDelete,
                      },
                    ],
                  },
                },
                {
                  type: "button",
                  icon: {
                    type: "sfSymbol",
                    name: entry?.bookmark ? "bookmark.fill" : "bookmark",
                  },
                  label: entry?.bookmark ? "Unbookmark" : "Bookmark",
                  tintColor: entry?.bookmark ? PlatformColor("systemIndigo") : undefined,
                  onPress: handleBookmark,
                },
                {
                  type: "button",
                  label: "Edit",
                  onPress: () => setEditMode(true),
                },
              ],
        }}
      />

      {entry &&
        (editMode ? (
          <EntryEditView
            entry={entry}
            onSave={() => setEditMode(false)}
            onCancel={() => setEditMode(false)}
          />
        ) : (
          <EntryDetailView entry={entry} />
        ))}
    </>
  );
}
