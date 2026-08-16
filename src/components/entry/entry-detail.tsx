import { PlatformColor, View } from "react-native";

import { Host, List, Section, Text } from "@expo/ui/swift-ui";
import { frame, listStyle } from "@expo/ui/swift-ui/modifiers";

import { EntryDetailObj } from "@/db/queries/entries";
import { deserializeValue } from "@/hooks/entry/use-entry";
import { formatDate } from "@/utils/date";

import { EntryFieldItem } from "./entry-field-item";

type Props = {
  /** エントリーデータ */
  entry: EntryDetailObj;
};

/**
 * エントリー詳細画面
 */
export function EntryDetailView({ entry }: Props) {
  const sorted = [...entry.values].sort((a, b) => a.field.sortOrder - b.field.sortOrder);

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{
          flex: 1,
          backgroundColor: PlatformColor("systemBackground"),
        }}
        useViewportSizeMeasurement
      >
        <List modifiers={[frame({ maxWidth: 9999, maxHeight: 9999 }), listStyle("plain")]}>
          <Section header={<Text>{formatDate(entry.createdAt)}</Text>}>
            {sorted.map((v) => (
              <EntryFieldItem
                key={v.id}
                field={v.field}
                value={deserializeValue(v.value, v.field.type)}
              />
            ))}
          </Section>
        </List>
      </Host>
    </View>
  );
}
