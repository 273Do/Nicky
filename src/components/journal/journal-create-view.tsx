import { useState } from "react";
import { PlatformColor, View } from "react-native";

import {
  Button,
  Host,
  HStack,
  Image,
  List,
  Section,
  Text,
  VStack,
} from "@expo/ui/swift-ui";
import {
  environment,
  foregroundStyle,
  frame,
  listRowInsets,
} from "@expo/ui/swift-ui/modifiers";
import { SFSymbol } from "expo-symbols";

import { FieldBottomSheet } from "./field-bottom-sheet";

type FieldType = "text" | "number" | "check";

type Field = {
  id: string;
  type: FieldType;
  label: string;
};

const FIELD_ICONS: Record<FieldType, SFSymbol> = {
  text: "text.quote",
  number: "numbers.rectangle.fill",
  check: "checkmark.circle.fill",
} as const;

/**
 * ジャーナル作成画面
 */
export function JournalCreateView() {
  const [showFieldBottomSheet, setShowieldBottomSheet] =
    useState<boolean>(false);

  const [fields, setFields] = useState<Field[]>([
    { id: "1", type: "text", label: "text" },
    { id: "2", type: "number", label: "number" },
    { id: "3", type: "check", label: "check" },
  ]);

  function handleMove(sourceIndices: number[], destination: number) {
    setFields((prev) => {
      const next = [...prev];
      const moved = sourceIndices.map((i) => next[i]);
      sourceIndices.sort((a, b) => b - a).forEach((i) => next.splice(i, 1));
      next.splice(destination, 0, ...moved);
      return next;
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <Host
        style={{ flex: 1, backgroundColor: PlatformColor("systemBackground") }}
        useViewportSizeMeasurement
      >
        <List
          modifiers={[
            frame({ maxWidth: 9999, maxHeight: 9999 }),
            environment("editMode", "active"),
          ]}
        >
          <Section
            header={
              <VStack>
                <Text>Fields</Text>
              </VStack>
            }
          >
            <List.ForEach onMove={handleMove}>
              <>
                {fields.map((field) => (
                  <Button
                    key={field.id}
                    modifiers={[
                      listRowInsets({ leading: 16 }),
                      foregroundStyle({
                        type: "hierarchical",
                        style: "primary",
                      }),
                    ]}
                  >
                    <HStack spacing={12}>
                      <Image
                        systemName={FIELD_ICONS[field.type]}
                        color={PlatformColor("systemIndigo")}
                        modifiers={[frame({ width: 28 })]}
                      />
                      <Text
                        modifiers={[foregroundStyle(PlatformColor("label"))]}
                      >
                        {field.label}
                      </Text>
                    </HStack>
                  </Button>
                ))}
              </>
            </List.ForEach>

            <Button
              label="Add New Field"
              systemImage="plus"
              onPress={() => {
                setShowieldBottomSheet(true);
              }}
            />
          </Section>
        </List>

        <FieldBottomSheet
          showFieldBottomSheet={showFieldBottomSheet}
          setShowieldBottomSheet={setShowieldBottomSheet}
        />
      </Host>
    </View>
  );
}
