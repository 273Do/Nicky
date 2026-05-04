import { useState } from "react";
import { PlatformColor, View } from "react-native";

import {
  Button,
  Host,
  HStack,
  Image,
  List,
  Section,
  Spacer,
  Text,
} from "@expo/ui/swift-ui";
import {
  environment,
  frame,
  listRowInsets,
  padding,
} from "@expo/ui/swift-ui/modifiers";

import {
  FIELD_ICONS,
  FieldObj,
  FieldType,
} from "@/hooks/journal/use-journal-field";

import { FieldBottomSheet } from "./field-bottom-sheet";

type Props = {
  fields: FieldObj[];
  addField: (type: FieldType) => void;
  deleteField: (indices: number[]) => void;
  moveField: (sourceIndices: number[], destination: number) => void;
};

/**
 * ジャーナル作成画面
 */
export function JournalCreateView({
  fields,
  addField,
  deleteField,
  moveField,
}: Props) {
  const [showBottomSheet, setShowBottomSheet] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            environment("editMode", "inactive"),
          ]}
        >
          <Section title="Fields">
            <List.ForEach onMove={moveField} onDelete={deleteField}>
              {fields.map((field) => (
                <HStack
                  key={field.id}
                  spacing={16}
                  modifiers={[listRowInsets({ leading: 16 })]}
                >
                  <Image
                    systemName={FIELD_ICONS[field.type]}
                    color={PlatformColor("systemIndigo")}
                    size={22}
                    modifiers={[frame({ width: 24 })]}
                  />
                  <Text>{field.label}</Text>
                  <Spacer />
                  <Image
                    systemName="line.3.horizontal"
                    color={PlatformColor("tertiaryLabel")}
                    size={22}
                    modifiers={[
                      frame({ width: 28 }),
                      padding({ trailing: 14 }),
                    ]}
                  />
                </HStack>
              ))}
            </List.ForEach>

            <Button
              label="Add Field"
              systemImage="plus"
              onPress={() => setShowBottomSheet(true)}
            />
          </Section>
        </List>

        <FieldBottomSheet
          isPresented={showBottomSheet}
          onIsPresentedChange={setShowBottomSheet}
          onAdd={addField}
        />
      </Host>
    </View>
  );
}
