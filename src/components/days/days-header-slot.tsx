import { PlatformColor, StyleSheet, Text } from "react-native";
import Animated, { type SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { slotDiff } from "@/utils/days/slot-diff";

type Props = {
  slotIndex: number;
  centerSlot: SharedValue<number>;
  translateX: SharedValue<number>;
  screenWidth: number;
  glassWidth: SharedValue<number>;
  label: string;
};

/**
 * ヘッダー日付のローテーティングスロット
 */
export function DaysHeaderSlot({
  slotIndex,
  centerSlot,
  translateX,
  screenWidth,
  glassWidth,
  label,
}: Props) {
  const style = useAnimatedStyle(() => {
    const diff = slotDiff(slotIndex, centerSlot.value);
    const p = translateX.value / screenWidth;
    return {
      transform: [{ translateX: (diff + p) * glassWidth.value }],
    };
  });

  return (
    <Animated.View style={[styles.headerLabel, style]}>
      <Text style={styles.headerText}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
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
});
