import { useState } from "react";
import { PlatformColor, Pressable, Text } from "react-native";

import { BottomSheet, DatePicker, Host } from "@expo/ui/swift-ui";
import { datePickerStyle, tint } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { Stack } from "expo-router";

import { formatDateDays } from "@/utils/date";

/**
 * Days 画面
 */
export default function DaysScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitleEnabled: false,
          headerTitle: () => (
            <Pressable onPress={() => setShowCalendar(true)}>
              <GlassView
                glassEffectStyle="regular"
                isInteractive
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 100,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "600", color: PlatformColor("label") }}>
                  {formatDateDays(selectedDate)}
                </Text>
              </GlassView>
            </Pressable>
          ),
        }}
      />

      <Host matchContents>
        <BottomSheet isPresented={showCalendar} onIsPresentedChange={setShowCalendar} fitToContents>
          <DatePicker
            selection={selectedDate}
            onDateChange={setSelectedDate}
            displayedComponents={["date"]}
            modifiers={[datePickerStyle("graphical"), tint(PlatformColor("systemIndigo"))]}
          />
        </BottomSheet>
      </Host>
    </>
  );
}
