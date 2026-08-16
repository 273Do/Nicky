import { useState } from "react";
import { Alert, PlatformColor } from "react-native";

import { Stack, useRouter } from "expo-router";
import { z } from "zod";

import { EntryCreateView } from "@/components/entry/entry-create-view";
import { EntryDetailView } from "@/components/entry/entry-detail";
import { useEntryDetail } from "@/hooks/entry/use-entry-detail";
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

  const { entry, valuesRef, setValue, save, bookmark, remove } = useEntryDetail(entryId);

  const handleSave = async () => {
    try {
      await save();
      setEditMode(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert("Validation Error", error.issues[0].message);
      }
    }
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
                    onPress: bookmark,
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
