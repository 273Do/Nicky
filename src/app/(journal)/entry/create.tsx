import {
  PlatformColor,
  Pressable,
  Text as RNText,
  StyleSheet,
  View,
} from "react-native";

import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { EntryCreateView } from "@/components/entry/entry-create-view";
import { useJournalField } from "@/utils/journal/use-journal-field";

/**
 * エントリー作成
 */
export default function EntryCreateScreen() {
  const router = useRouter();

  const { name } = useLocalSearchParams<{ name: string }>();

  const { createJournal, formDisabled } = useJournalField();

  const handleCreate = async () => {
    const { id } = await createJournal();

    // replace でスタックせずにジャーナル詳細画面からジャーナル一覧へ戻れるようにする
    router.replace(`/(journal)/entry/${id}}`);
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
            <Pressable onPress={handleCreate} disabled={formDisabled}>
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
      <EntryCreateView />
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
