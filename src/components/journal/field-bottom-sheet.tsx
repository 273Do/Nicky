import { Dispatch, SetStateAction, useState } from "react";

import {
  BottomSheet,
  Button,
  Group,
  List,
  Section,
  Text,
} from "@expo/ui/swift-ui";
import {
  foregroundStyle,
  presentationBackgroundInteraction,
  PresentationDetent,
  presentationDetents,
  presentationDragIndicator,
} from "@expo/ui/swift-ui/modifiers";

const detents: PresentationDetent[] = [
  { height: 300 },
  { fraction: 0.3 },
  "medium",
  "large",
];

const formatDetent = (detent: PresentationDetent): string => {
  if (typeof detent === "string") return detent;
  if ("fraction" in detent) return `Fraction ${detent.fraction}`;
  return `Height ${detent.height}`;
};

type Props = {
  showFieldBottomSheet: boolean;
  setShowieldBottomSheet: Dispatch<SetStateAction<boolean>>;
};

/**
 * フィールド設定ボトムシート
 */
export function FieldBottomSheet({
  showFieldBottomSheet,
  setShowieldBottomSheet,
}: Props) {
  const [selectedDetent, setSelectedDetent] =
    useState<PresentationDetent>("medium");

  return (
    <BottomSheet
      isPresented={showFieldBottomSheet}
      onIsPresentedChange={setShowieldBottomSheet}
    >
      <Group
        modifiers={[
          presentationDetents(detents, {
            selection: selectedDetent,
            onSelectionChange: setSelectedDetent,
          }),
          presentationDragIndicator("visible"),
          presentationBackgroundInteraction({
            type: "enabledUpThrough",
            detent: "medium",
          }),
        ]}
      >
        <Text>sss</Text>
        <List>
          <Section title="Change Detent">
            <Button
              label="Height 300"
              onPress={() => setSelectedDetent({ height: 300 })}
            />
            <Button
              label="Fraction 0.3"
              onPress={() => setSelectedDetent({ fraction: 0.3 })}
            />
            <Button
              label="Medium"
              onPress={() => setSelectedDetent("medium")}
            />
            <Button label="Large" onPress={() => setSelectedDetent("large")} />
          </Section>
          <Section title="Current">
            <Text modifiers={[foregroundStyle("secondaryLabel")]}>
              {formatDetent(selectedDetent)}
            </Text>
          </Section>
        </List>
      </Group>
    </BottomSheet>
  );
}
