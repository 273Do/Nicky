import {
  PlatformColor,
  Pressable,
  Text as RNText,
  StyleSheet,
  View,
} from "react-native";

import {
  Host,
  List,
  Section,
  Text,
  TextField,
  VStack,
} from "@expo/ui/swift-ui";
import {
  font,
  foregroundStyle,
  frame,
  listStyle,
} from "@expo/ui/swift-ui/modifiers";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { formatDate } from "@/utils/date";
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

  const now = Date.now();

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
      <View style={{ flex: 1 }}>
        <Host
          style={{
            flex: 1,
            backgroundColor: PlatformColor("systemBackground"),
          }}
          useViewportSizeMeasurement
        >
          <List
            modifiers={[
              frame({ maxWidth: 9999, maxHeight: 9999 }),
              listStyle("plain"),
            ]}
          >
            <Section title={formatDate(now)}>
              <VStack alignment="leading" spacing={4}>
                <Text
                  modifiers={[
                    font({ size: 12 }),
                    foregroundStyle({
                      type: "hierarchical",
                      style: "secondary",
                    }),
                  ]}
                >
                  hogehoge
                </Text>

                <TextField
                  placeholder="fugafuga"
                  modifiers={[frame({ maxWidth: 9999 })]}
                />
              </VStack>
            </Section>
          </List>
        </Host>
      </View>
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
    fontSize: 12,
    color: PlatformColor("secondaryLabel"),
  },
});
