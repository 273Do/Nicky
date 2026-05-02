import { PlatformColor, Pressable, StyleSheet, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { frame, headerProminence } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { ENTRIES, type EntryObj } from "@/mocks/entries";
import { formatYearMonth } from "@/utils/date";

import { EntryRow } from "./entry-row";

function groupByMonth(
  entries: EntryObj[],
): { month: string; entries: EntryObj[] }[] {
  const map = new Map<string, EntryObj[]>();
  for (const entry of entries) {
    const key = `${entry.date.getFullYear()}-${entry.date.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries()).map(([, entries]) => ({
    month: formatYearMonth(entries[0].date),
    entries,
  }));
}

type Props = {
  searchText?: string;
};

export function EntryListView({ searchText = "" }: Props) {
  const router = useRouter();
  const filtered = searchText
    ? ENTRIES.filter(
        (e) => e.title.includes(searchText) || e.preview.includes(searchText),
      )
    : ENTRIES;
  const grouped = groupByMonth(filtered);

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 })]}>
          {grouped.map(({ month, entries }) => (
            <Section
              key={month}
              title={month}
              modifiers={[headerProminence("increased")]}
            >
              {entries.map((entry) => (
                <EntryRow key={entry.id} entry={entry} />
              ))}
            </Section>
          ))}
        </List>
      </Host>

      <Pressable
        onPress={() => router.push("/(journal)/create")}
        style={styles.fab}
      >
        <GlassView
          glassEffectStyle="regular"
          tintColor={PlatformColor("systemGra1y3") as unknown as string}
          style={styles.glassButton}
        >
          <SymbolView name="plus" tintColor={PlatformColor("label")} />
        </GlassView>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 102,
    right: 16,
  },
  glassButton: {
    width: 62,
    height: 62,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
});
