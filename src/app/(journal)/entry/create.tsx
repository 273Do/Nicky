import { Keyboard, PlatformColor } from "react-native";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { EntryCreateView } from "@/components/entry/entry-create-view";
import { getFieldsQuery } from "@/db/queries/fields";
import { useEntry } from "@/utils/entry/use-entry";

/**
 * エントリー作成
 */
export default function EntryCreateScreen() {
  const router = useRouter();

  const { journalId, journalName } = useLocalSearchParams<{
    journalId: string;
    journalName: string;
  }>();

  const { data: fields } = useLiveQuery(getFieldsQuery(journalId), [journalId]);
  const { valuesRef, setValue, createEntry } = useEntry(fields);

  const handleEntryCreate = async () => {
    Keyboard.dismiss();
    const { id: newEntryId } = await createEntry(journalId);
    router.replace(`/(journal)/entry/${newEntryId}?journalName=${journalName}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: journalName,
          headerLargeTitleEnabled: true,
          // エントリー作成では disabled は設定しない
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: "Create New Entry",
              icon: { type: "sfSymbol", name: "checkmark" },
              tintColor: PlatformColor("systemIndigo"),
              variant: "prominent",
              onPress: handleEntryCreate,
            },
          ],
        }}
      />
      <EntryCreateView
        id={journalId}
        values={valuesRef.current}
        setValue={setValue}
      />
    </>
  );
}
