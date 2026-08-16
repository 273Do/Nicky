import { Alert, Keyboard, PlatformColor } from "react-native";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useRouter } from "expo-router";
import { z } from "zod";

import { EntryCreateView } from "@/components/entry/entry-create-view";
import { getFieldsQuery } from "@/db/queries/fields";
import { useEntry } from "@/hooks/entry/use-entry";
import { useValidatedParams } from "@/hooks/use-validated-params";

/**
 * エントリー作成
 */
export default function EntryCreateScreen() {
  const router = useRouter();

  const schema = z.object({ journalId: z.string(), journalName: z.string() });
  const { journalId, journalName } = useValidatedParams(schema);

  const { data: fields } = useLiveQuery(getFieldsQuery(journalId), [journalId]);
  const { valuesRef, setValue, createEntry } = useEntry(fields);

  const handleEntryCreate = async () => {
    Keyboard.dismiss();

    try {
      const { id: newEntryId } = await createEntry(journalId);
      router.replace(`/(journal)/entry/${newEntryId}?journalName=${journalName}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        Alert.alert("Validation Error", error.issues[0].message);
      }
    }
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
      <EntryCreateView id={journalId} values={valuesRef.current} setValue={setValue} />
    </>
  );
}
