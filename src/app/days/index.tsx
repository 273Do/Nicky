import { useState } from "react";
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
import { Stack } from "expo-router";

import { addDays, formatDateDays } from "@/utils/date";

const SWIPE_THRESHOLD = 50;

/**
 * Days 画面
 */
export default function DaysScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [showCalendar, setShowCalendar] = useState(false);

  const glassWidth = useSharedValue(200);

  const translateX = useSharedValue(0);

  const prevDate = addDays(selectedDate, -1);
  const nextDate = addDays(selectedDate, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canGoNext = nextDate <= today;

  const commitDate = (timestamp: number) => {
    setSelectedDate(new Date(timestamp));
    requestAnimationFrame(() => {
      translateX.value = 0;
    });
  };

  const handleSwipeEnd = (translationX: number) => {
    if (translationX < -SWIPE_THRESHOLD && canGoNext) {
      const ts = nextDate.getTime();
      translateX.value = withTiming(-screenWidth, { duration: 200 }, () => {
        runOnJS(commitDate)(ts);
      });
    } else if (translationX > SWIPE_THRESHOLD) {
      const ts = prevDate.getTime();
      translateX.value = withTiming(screenWidth, { duration: 200 }, () => {
        runOnJS(commitDate)(ts);
      });
    } else {
      translateX.value = withTiming(0, { duration: 200 });
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .failOffsetY([-10, 10])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      runOnJS(handleSwipeEnd)(event.translationX);
    });

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const currentHeaderStyle = useAnimatedStyle(() => {
    const p = translateX.value / screenWidth;
    return { transform: [{ translateX: p * glassWidth.value }] };
  });
  const prevHeaderStyle = useAnimatedStyle(() => {
    const p = translateX.value / screenWidth;
    return { transform: [{ translateX: (p - 1) * glassWidth.value }] };
  });
  const nextHeaderStyle = useAnimatedStyle(() => {
    const p = translateX.value / screenWidth;
    return { transform: [{ translateX: (p + 1) * glassWidth.value }] };
  });

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
                style={styles.headerGlass}
                onLayout={(e) => {
                  glassWidth.value = e.nativeEvent.layout.width;
                }}
              >
                <Text style={[styles.headerText, styles.headerSizer]}>
                  {formatDateDays(selectedDate)}
                </Text>

                <Animated.View style={[styles.headerLabel, prevHeaderStyle]}>
                  <Text style={styles.headerText}>{formatDateDays(prevDate)}</Text>
                </Animated.View>

                <Animated.View style={[styles.headerLabel, currentHeaderStyle]}>
                  <Text style={styles.headerText}>{formatDateDays(selectedDate)}</Text>
                </Animated.View>

                {canGoNext && (
                  <Animated.View style={[styles.headerLabel, nextHeaderStyle]}>
                    <Text style={styles.headerText}>{formatDateDays(nextDate)}</Text>
                  </Animated.View>
                )}
              </GlassView>
            </Pressable>
          ),
        }}
      />

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.pager, stripStyle]}>
          <View
            style={[styles.page, { width: screenWidth, transform: [{ translateX: -screenWidth }] }]}
          >
            <View style={[styles.dot, { backgroundColor: PlatformColor("systemIndigo") }]} />
          </View>

          <View style={[styles.page, { width: screenWidth }]}>
            <View style={[styles.dot, { backgroundColor: PlatformColor("systemIndigo") }]} />
          </View>

          {canGoNext && (
            <View
              style={[
                styles.page,
                { width: screenWidth, transform: [{ translateX: screenWidth }] },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: PlatformColor("systemIndigo") }]} />
            </View>
          )}
        </Animated.View>
      </GestureDetector>

      <Host matchContents>
        <BottomSheet isPresented={showCalendar} onIsPresentedChange={setShowCalendar} fitToContents>
          <DatePicker
            modifiers={[datePickerStyle("graphical"), tint(PlatformColor("systemIndigo"))]}
            selection={selectedDate}
            onDateChange={setSelectedDate}
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
    paddingVertical: 8,
    borderRadius: 100,
    overflow: "hidden",
  },
  headerSizer: {
    opacity: 0,
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
  page: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    paddingTop: 120,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
