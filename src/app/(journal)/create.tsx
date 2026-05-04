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

  const { fields, addField, deleteField, moveField } = useJournalField();

  const handleCreate = () => {
    console.log(fields);

    router.push(`/(journal)/1}`);
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
                tintColor={PlatformColor("systemIndigo")}
              />
            </Pressable>
          ),
        }}
      />
      <JournalCreateView
        fields={fields}
        addField={addField}
        deleteField={deleteField}
        moveField={moveField}
      />
    </>
  );
}
