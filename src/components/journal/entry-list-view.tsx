import { PlatformColor, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { frame, headerProminence } from "@expo/ui/swift-ui/modifiers";

import { ENTRIES, type Entry } from "@/mocks/entries";

import { EntryRow } from "./entry-row";

function groupByMonth(entries: Entry[]): { month: string; entries: Entry[] }[] {
  const map = new Map<string, Entry[]>();
  for (const entry of entries) {
    const [year, month] = entry.date.split("/");
    const key = `${year}年${Number(month)}月`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries()).map(([month, entries]) => ({
    month,
    entries,
  }));
}

export const EntryListView = () => {
  const grouped = groupByMonth(ENTRIES);

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
    </View>
  );
};
