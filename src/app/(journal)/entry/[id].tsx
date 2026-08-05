import { useState } from "react";
import { PlatformColor } from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { EntryCreateView } from "@/components/entry/entry-create-view";
import { EntryDetailView } from "@/components/entry/entry-detail";
import { useEntryDetail } from "@/utils/entry/use-entry-detail";

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

  const { entry, valuesRef, setValue, save, bookmark, remove } = useEntryDetail(entryId);

  const handleSave = async () => {
    await save();
    setEditMode(false);
  };

  const handleDelete = async () => {
    await remove();
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
                    variant: "prominent",
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
                            name: entry?.bookmark ? "bookmark.slash" : "bookmark",
                          },
                          label: entry?.bookmark ? "Unbookmark" : "Bookmark",
                          onPress: bookmark,
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
