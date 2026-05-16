import { useState } from "react";
import { PlatformColor } from "react-native";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { EntryCreateView } from "@/components/entry/entry-create-view";
import { EntryDetailView } from "@/components/entry/entry-detail";
import {
  bookmarkEntry,
  deleteEntry,
  getEntryDetailQuery,
} from "@/db/queries/entries";
import { buildEntryFormData } from "@/utils/entry/entry-form";
import { useEntry } from "@/utils/entry/use-entry";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const router = useRouter();

  const {
    id: entryId,
    journalName,
    edit,
  } = useLocalSearchParams<{
    id: string;
    journalName: string;
    edit: string;
  }>();

  const [editMode, setEditMode] = useState<boolean>(Boolean(edit));

  const { data: entry } = useLiveQuery(getEntryDetailQuery(entryId));

  const { fields, initialValues } = entry
    ? buildEntryFormData(entry)
    : { fields: [], initialValues: null };

  const { valuesRef, setValue, updateEntry } = useEntry(fields, initialValues);

  const handleSave = async () => {
    await updateEntry(entryId);
    setEditMode(false);
  };

  const handleBookmark = async () => {
    if (entry) await bookmarkEntry(entry.id, !entry.bookmark);
  };

  const handleDelete = async () => {
    await deleteEntry(entryId);
    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: journalName,
          headerLargeTitleEnabled: true,
          unstable_headerRightItems: () =>
            editMode
              ? [
                  {
                    type: "button",
                    label: "Cancel",
                    onPress: () => setEditMode(false),
                  },
                  {
                    type: "button",
                    label: "Save",
                    icon: { type: "sfSymbol", name: "checkmark" },
                    tintColor: PlatformColor("systemIndigo"),
                    onPress: handleSave,
                  },
                ]
              : [
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
                            name: entry?.bookmark
                              ? "bookmark.slash"
                              : "bookmark",
                          },
                          label: entry?.bookmark ? "Unbookmark" : "Bookmark",
                          onPress: handleBookmark,
                        },
                        {
                          type: "action",
                          label: "Delete",
                          icon: { type: "sfSymbol", name: "trash" },
                          destructive: true,
                          onPress: handleDelete,
                        },
                      ],
                    },
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
          <EntryCreateView
            id={entry.journalId}
            values={valuesRef.current}
            setValue={setValue}
            createdAt={entry.createdAt}
          />
        ) : (
          <EntryDetailView entry={entry} />
        ))}
    </>
  );
}
