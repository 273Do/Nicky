import { PlatformColor, Pressable } from "react-native";

import { Stack, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { JournalCreateView } from "@/components/journal/journal-create-view";
import { useJournalField } from "@/hooks/journal/use-journal-field";

/**
 * ジャーナル作成
 */
export default function JournalCreateScreen() {
  const router = useRouter();

  const {
    fields,
    addField,
    renameField,
    deleteField,
    moveField,
    meta,
    setMeta,
    createJournal,
    formDisabled,
  } = useJournalField();

  const handleCreate = () => {
    router.push(`/(journal)/1`);
    createJournal();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "New Journal",
          headerRight: () => (
            <Pressable onPress={handleCreate}>
              <SymbolView
                name="checkmark"
                tintColor={
                  formDisabled
                    ? PlatformColor("tertiaryLabel")
                    : PlatformColor("systemIndigo")
                }
              />
            </Pressable>
          ),
        }}
      />
      <JournalCreateView
        fields={fields}
        addField={addField}
        renameField={renameField}
        deleteField={deleteField}
        moveField={moveField}
        meta={meta}
        setMeta={setMeta}
      />
    </>
  );
}
