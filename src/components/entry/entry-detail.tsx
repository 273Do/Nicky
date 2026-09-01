import { PlatformColor, View } from "react-native";

import { Host, List, Section, Text, VStack } from "@expo/ui/swift-ui";
import { frame, listStyle } from "@expo/ui/swift-ui/modifiers";

import { EntryDetailObj } from "@/db/queries/entries";
import { deserializeValue } from "@/hooks/entry/use-entry";
import { formatDate } from "@/utils/date";
import { parseLocation } from "@/utils/entry/field-value";

import { InlineMapView } from "../field/inline-map-view";
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
    <View style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}>
      <Host style={{ flex: 1 }} useViewportSizeMeasurement>
        <List modifiers={[frame({ maxWidth: 9999 }), listStyle("plain")]}>
          <Section header={<Text>{formatDate(entry.createdAt)}</Text>}>
            {sorted.map((v) => {
              const value = deserializeValue(v.value, v.field.type);
              const location =
                v.field.type === "location" && typeof value === "string"
                  ? parseLocation(value)
                  : null;

              return (
                <VStack key={v.id} alignment="leading" spacing={8}>
                  <EntryFieldItem field={v.field} value={value} />
                  {location && (
                    <InlineMapView lat={location.lat} lng={location.lng} title={location.address} />
                  )}
                </VStack>
              );
            })}
          </Section>
        </List>
      </Host>
    </View>
  );
}
