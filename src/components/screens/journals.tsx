import { Grid, ScrollView, Text, VStack } from "@expo/ui/swift-ui";
import { font, padding } from "@expo/ui/swift-ui/modifiers";
import type { SFSymbol } from "sf-symbols-typescript";

import { Folder } from "../journals/folder";

type Shortcut = {
  id: string;
  name: string;
  icon: SFSymbol;
  color: string;
  count: number;
};

const SHORTCUTS: Shortcut[] = [
  {
    id: "1",
    name: "Morning Routine",
    icon: "sun.max.fill",
    color: "#FF9F0A",
    count: 12,
  },
  { id: "2", name: "Work Timer", icon: "timer", color: "#0A84FF", count: 5 },
  {
    id: "3",
    name: "Text Home",
    icon: "message.fill",
    color: "#30D158",
    count: 8,
  },
  {
    id: "4",
    name: "Play Music",
    icon: "music.note",
    color: "#BF5AF2",
    count: 3,
  },
  {
    id: "5",
    name: "Set Alarm",
    icon: "alarm.fill",
    color: "#FF375F",
    count: 20,
  },
  {
    id: "6",
    name: "Location",
    icon: "location.fill",
    color: "#5E5CE6",
    count: 1,
  },
  {
    id: "7",
    name: "Log Water",
    icon: "drop.fill",
    color: "#32ADE6",
    count: 15,
  },
  {
    id: "8",
    name: "Focus Mode",
    icon: "moon.fill",
    color: "#636366",
    count: 7,
  },
];

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
export default function JournalsScreen() {
  const rows = chunkArray(SHORTCUTS, 2);

  return (
    <ScrollView showsIndicators={false}>
      <VStack
        alignment="leading"
        spacing={0}
        modifiers={[padding({ horizontal: 16 })]}
      >
        <Text
          modifiers={[
            font({ size: 34, weight: "bold" }),
            padding({ top: 16, bottom: 4 }),
          ]}
        >
          Journals
        </Text>

        <Grid
          verticalSpacing={10}
          horizontalSpacing={10}
          modifiers={[padding({ top: 16, bottom: 32 })]}
        >
          {rows.map((row, rowIndex) => (
            <Grid.Row key={rowIndex}>
              {row.map((shortcut) => (
                <Folder
                  key={shortcut.id}
                  name={shortcut.name}
                  icon={shortcut.icon}
                  color={shortcut.color}
                  count={shortcut.count}
                />
              ))}
            </Grid.Row>
          ))}
        </Grid>
      </VStack>
    </ScrollView>
  );
}
