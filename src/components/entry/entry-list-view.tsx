import { PlatformColor, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { frame, headerProminence } from "@expo/ui/swift-ui/modifiers";

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

/**
 * エントリー一覧画面
 */
export function EntryListView() {
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
}
