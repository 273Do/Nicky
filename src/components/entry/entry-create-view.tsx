import { PlatformColor, View } from "react-native";

import { Host, List, Section } from "@expo/ui/swift-ui";
import { frame, listStyle } from "@expo/ui/swift-ui/modifiers";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";

import { getFieldsQuery } from "@/db/queries/fields";
import { formatDate } from "@/utils/date";
import { FieldValue } from "@/utils/entry/use-entry";

import { EntryFieldItem } from "./entry-field-item";

type Props = {
  /** ジャーナル id */
  id: string;
  /** 現在のフィールドの値 */
  values: Record<string, FieldValue>;
  /** フィールドに値を格納する関数 */
  setValue: (id: string, value: FieldValue) => void;
  /** エントリー作成日(編集画面に使用する) */
  createdAt?: number;
};

/**
 * エントリー作成画面
 */
export function EntryCreateView({
  id,
  values,
  setValue,
  createdAt = undefined,
}: Props) {
  const now = Date.now();

  const { data: fields } = useLiveQuery(getFieldsQuery(id), [id]);

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
          <Section title={createdAt ? formatDate(createdAt) : formatDate(now)}>
            {fields.map((field) => (
              <EntryFieldItem
                key={field.id}
                field={field}
                value={values[field.id]}
                setValue={setValue}
                edit
              />
            ))}
          </Section>
        </List>
      </Host>
    </View>
  );
}
