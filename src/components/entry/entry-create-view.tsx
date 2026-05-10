import { PlatformColor, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { frame, listStyle } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getFieldsQuery } from "@/db/queries/fields";
import { formatDate } from "@/utils/date";
import { useEntry } from "@/utils/journal/use-entry";

import { EntryFieldItem } from "./entry-field-item";

type Props = {
  id: string;
  /** ジャーナル id */
};

/**
 * エントリー作成画面
 */
export function EntryCreateView({ id }: Props) {
  const now = Date.now();
  console.log(id);

  const { data: fields } = useLiveQuery(getFieldsQuery(id));

  const { values, setValue } = useEntry(fields);
  if (!fields) return null;

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            listStyle("plain"),
          ]}
        >
          <Section title={formatDate(now)}>
            {fields.map((field) => (
              <EntryFieldItem
                key={field.id}
                field={field}
                value={values[field.id]}
                setValue={setValue}
              />
            ))}
          </Section>
        </List>
      </Host>
    </View>
  );
}
