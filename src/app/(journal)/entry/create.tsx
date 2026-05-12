import {
  PlatformColor,
  Pressable,
  Text as RNText,
  StyleSheet,
  View,
} from "react-native";

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

  const { id: jounalId, name } = useLocalSearchParams<{
    id: string;
    name: string;
  }>();

  const { data: fields } = useLiveQuery(getFieldsQuery(jounalId));
  const { valuesRef, setValue, createEntry } = useEntry(fields);

  const handleEntryCreate = async () => {
    const { id: newEntryId } = await createEntry(jounalId);
    router.replace(`/(journal)/entry/${newEntryId}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <RNText style={styles.title}>New Entry</RNText>
              <RNText style={styles.subtitle}>{name}</RNText>
            </View>
          ),
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
        id={jounalId}
        values={valuesRef.current}
        setValue={setValue}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitle: {
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: PlatformColor("label"),
  },
  subtitle: {
    fontSize: 14,
    color: PlatformColor("secondaryLabel"),
  },
});
