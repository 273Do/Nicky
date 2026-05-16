import { PlatformColor, Pressable } from "react-native";

import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

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

  const { data: fields } = useLiveQuery(getFieldsQuery(journalId));
  const { valuesRef, setValue, createEntry } = useEntry(fields);

  const handleEntryCreate = async () => {
    const { id: newEntryId } = await createEntry(journalId);
    router.replace(`/(journal)/entry/${newEntryId}?journalName=${journalName}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: journalName,
          headerLargeTitleEnabled: true,
          // headerTitle: () => (
          //   <View style={styles.headerTitle}>
          //     <RNText style={styles.title}>New Entry</RNText>
          //     <RNText style={styles.subtitle}>{journalName}</RNText>
          //   </View>
          // ),
          headerRight: () => (
            // エントリー作成では disabled は設定しない
            <Pressable onPress={handleEntryCreate}>
              <SymbolView
                name="checkmark"
                tintColor={PlatformColor("systemIndigo")}
              />
            </Pressable>
          ),
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

// const styles = StyleSheet.create({
//   headerTitle: {
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 17,
//     fontWeight: "600",
//     color: PlatformColor("label"),
//   },
//   subtitle: {
//     fontSize: 14,
//     color: PlatformColor("secondaryLabel"),
//   },
// });
