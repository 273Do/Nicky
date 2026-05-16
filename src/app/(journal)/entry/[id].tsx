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
import { FieldObj } from "@/db/schemas";
import {
  deserializeValue,
  FieldValue,
  useEntry,
} from "@/utils/entry/use-entry";

/**
 * エントリー詳細
 */
export default function EntryDetailScreen() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  const { id: entryId, journalName } = useLocalSearchParams<{
    id: string;
    journalName: string;
  }>();

  const { data: entry } = useLiveQuery(getEntryDetailQuery(entryId));

  // entry.values からフィールド一覧と初期値を導出
  const fields: FieldObj[] = entry
    ? [...entry.values]
        .sort((a, b) => a.field.sortOrder - b.field.sortOrder)
        .map((v) => v.field)
    : [];

  const initialValues: Record<string, FieldValue> | null = entry
    ? Object.fromEntries(
        entry.values.map((v) => [
          v.fieldId,
          deserializeValue(v.value, v.field.type),
        ]),
      )
    : null;

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
