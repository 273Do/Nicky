import { StyleSheet } from "react-native";
import Animated, { type SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { slotDiff } from "@/utils/days/slot-diff";

type Props = {
  slotIndex: number;
  centerSlot: SharedValue<number>;
  translateX: SharedValue<number>;
  screenWidth: number;
  children: React.ReactNode;
};

/**
 * ローテーティングバッファのページスロット
 * centerSlot と translateX から自身の位置を算出する
 */
export function DaysPageSlot({ slotIndex, centerSlot, translateX, screenWidth, children }: Props) {
  const style = useAnimatedStyle(() => {
    const diff = slotDiff(slotIndex, centerSlot.value);
    return {
      transform: [{ translateX: diff * screenWidth + translateX.value }],
    };
  });

  return (
    <Animated.View style={[styles.page, { width: screenWidth }, style]}>{children}</Animated.View>
  );
}

const styles = StyleSheet.create({
  page: {
    ...StyleSheet.absoluteFillObject,
  },
});
