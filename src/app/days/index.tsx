import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  PlatformColor,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { BottomSheet, DatePicker, Host } from "@expo/ui/swift-ui";
import { datePickerStyle, tint } from "@expo/ui/swift-ui/modifiers";
import { GlassView } from "expo-glass-effect";
import { Stack, useRouter } from "expo-router";

import { DaysHeaderSlot } from "@/components/days/days-header-slot";
import { DaysPageSlot } from "@/components/days/days-page-slot";
import { DaysView } from "@/components/days/days-view";
import { useDaysEntries } from "@/hooks/days/use-days-entries";
import { addDays, formatDateDays, startOfDay } from "@/utils/date";

const SWIPE_THRESHOLD = 50;

/**
 * Days 画面
 */
export default function DaysScreen() {
  const { t } = useTranslation();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();

  const today = startOfDay();

  const [selectedDate, setSelectedDate] = useState(() => today);
  const [slotDates, setSlotDates] = useState<[Date, Date, Date]>(() => [
    addDays(today, -1),
    today,
    addDays(today, 1),
  ]);
  const [showCalendar, setShowCalendar] = useState(false);

  // Refs for animation callbacks (closures)
  const slotDatesRef = useRef(slotDates);
  slotDatesRef.current = slotDates;

  // Shared values
  const centerSlot = useSharedValue(1);
  const translateX = useSharedValue(0);
  const glassWidth = useSharedValue(200);
  const canGoNextSV = useSharedValue(addDays(selectedDate, 1) <= today);

  // Header sizer: measure each slot's text width, interpolate during swipe
  const slotWidth0 = useSharedValue(0);
  const slotWidth1 = useSharedValue(0);
  const slotWidth2 = useSharedValue(0);
  const slotWidths = [slotWidth0, slotWidth1, slotWidth2] as const;

  const sizerStyle = useAnimatedStyle(() => {
    const ws = [slotWidth0.value, slotWidth1.value, slotWidth2.value];
    const center = centerSlot.value;
    const p = translateX.value / screenWidth;
    const absP = Math.min(Math.abs(p), 1);
    const target = p < 0 ? (center + 1) % 3 : (center + 2) % 3;
    const w = ws[center] * (1 - absP) + ws[target] * absP;
    return { width: w > 0 ? w : undefined };
  });

  // Derived
  const canGoNext = addDays(selectedDate, 1) <= today;
  canGoNextSV.value = canGoNext;

  // Data lifting — 1 query for entire range
  const entriesByDate = useDaysEntries(selectedDate);

  // After swipe: recycle the off-screen slot, update selectedDate
  const afterSwipe = (newCenter: number, direction: "left" | "right") => {
    const dates = slotDatesRef.current;
    const next = [...dates] as [Date, Date, Date];

    if (direction === "left") {
      const recycleSlot = (newCenter + 1) % 3;
      next[recycleSlot] = addDays(dates[newCenter], 1);
    } else {
      const recycleSlot = (newCenter + 2) % 3;
      next[recycleSlot] = addDays(dates[newCenter], -1);
    }

    slotDatesRef.current = next;
    setSlotDates(next);
    setSelectedDate(dates[newCenter]);
  };

  const handleSwipeEnd = (translationX: number) => {
    if (translationX < -SWIPE_THRESHOLD && canGoNextSV.value) {
      translateX.value = withTiming(-screenWidth, { duration: 200 }, (finished) => {
        if (!finished) return;
        const newCenter = (centerSlot.value + 1) % 3;
        centerSlot.value = newCenter;
        translateX.value = 0;
        runOnJS(afterSwipe)(newCenter, "left");
      });
    } else if (translationX > SWIPE_THRESHOLD) {
      translateX.value = withTiming(screenWidth, { duration: 200 }, (finished) => {
        if (!finished) return;
        const newCenter = (centerSlot.value + 2) % 3;
        centerSlot.value = newCenter;
        translateX.value = 0;
        runOnJS(afterSwipe)(newCenter, "right");
      });
    } else {
      translateX.value = withTiming(0, { duration: 200 });
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20])
    .failOffsetY([-15, 15])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      runOnJS(handleSwipeEnd)(event.translationX);
    });

  // Calendar picker: reset all slots
  const handleCalendarDate = (date: Date) => {
    const d = startOfDay(date);
    const newDates: [Date, Date, Date] = [addDays(d, -1), d, addDays(d, 1)];
    slotDatesRef.current = newDates;
    setSlotDates(newDates);
    setSelectedDate(d);
    centerSlot.value = 1;
    translateX.value = 0;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitleEnabled: false,
          headerTitle: () => (
            <Pressable onPress={() => setShowCalendar(true)}>
              {/* 幅計測用（不可視・GlassView外） */}
              <View style={styles.headerMeasure} pointerEvents="none">
                {slotDates.map((date, i) => (
                  <Text
                    key={i}
                    style={styles.headerText}
                    onLayout={(e) => {
                      slotWidths[i].value = e.nativeEvent.layout.width;
                    }}
                  >
                    {formatDateDays(date)}
                  </Text>
                ))}
              </View>

              <GlassView
                glassEffectStyle="regular"
                isInteractive
                style={styles.headerGlass}
                onLayout={(e) => {
                  glassWidth.value = e.nativeEvent.layout.width;
                }}
              >
                {/* 幅アニメーション用 sizer */}
                <Animated.View style={[styles.headerSizer, sizerStyle]} />

                <View style={styles.headerClip}>
                  {slotDates.map((date, i) => (
                    <DaysHeaderSlot
                      key={i}
                      slotIndex={i}
                      centerSlot={centerSlot}
                      translateX={translateX}
                      screenWidth={screenWidth}
                      glassWidth={glassWidth}
                      label={formatDateDays(date)}
                    />
                  ))}
                </View>
              </GlassView>
            </Pressable>
          ),
          unstable_headerRightItems: () => [
            {
              type: "button",
              label: t("settings.title"),
              icon: { type: "sfSymbol", name: "gearshape" },
              onPress: () => router.navigate("/days/settings"),
            },
          ],
        }}
      />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.pager}>
          {slotDates.map((date, i) => (
            <DaysPageSlot
              key={i}
              slotIndex={i}
              centerSlot={centerSlot}
              translateX={translateX}
              screenWidth={screenWidth}
            >
              <DaysView date={date} entries={entriesByDate.get(date.getTime())} />
            </DaysPageSlot>
          ))}
        </Animated.View>
      </GestureDetector>

      <Host matchContents>
        <BottomSheet isPresented={showCalendar} onIsPresentedChange={setShowCalendar} fitToContents>
          <DatePicker
            modifiers={[datePickerStyle("graphical"), tint(PlatformColor("systemIndigo"))]}
            selection={selectedDate}
            onDateChange={handleCalendarDate}
            displayedComponents={["date"]}
            range={{ end: today }}
          />
        </BottomSheet>
      </Host>
    </>
  );
}

const styles = StyleSheet.create({
  headerGlass: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
  },
  headerMeasure: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },
  headerSizer: {
    height: 20,
  },
  headerClip: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
  },
  headerLabel: {
    position: "absolute",
    width: 300,
    alignItems: "center",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: PlatformColor("label"),
  },
  pager: {
    flex: 1,
  },
});
