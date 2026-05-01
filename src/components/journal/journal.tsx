import { Image, RoundedRectangle, Text, ZStack } from "@expo/ui/swift-ui";
import {
  clipShape,
  font,
  foregroundStyle,
  frame,
  padding,
} from "@expo/ui/swift-ui/modifiers";
import type { SFSymbol } from "sf-symbols-typescript";

type Props = {
  /**
   * ジャーナル名
   */
  name: string;
  /**
   * アイコン
   */
  icon: SFSymbol;
  /**
   * カラー
   */
  color: string;
  /**
   * エントリー数
   */
  count: number;
};

function lightenColor(hex: string, amount = 40): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
}

export const Journal = ({ name, icon, color, count }: Props) => {
  return (
    <ZStack
      alignment="bottomLeading"
      modifiers={[frame({ height: 85 }), clipShape("roundedRectangle", 20)]}
    >
      <RoundedRectangle
        cornerRadius={20}
        modifiers={[
          frame({ maxWidth: 9999, maxHeight: 9999 }),
          foregroundStyle({
            type: "linearGradient",
            colors: [lightenColor(color), color],
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 0, y: 1 },
          }),
        ]}
      />
      <Image
        systemName={icon}
        color="white"
        size={24}
        modifiers={[
          frame({ maxWidth: 9999, maxHeight: 9999, alignment: "topLeading" }),
          padding({ all: 14 }),
        ]}
      />
      <Text
        modifiers={[
          frame({ maxWidth: 9999, maxHeight: 9999, alignment: "topTrailing" }),
          padding({ top: 14, trailing: 14 }),
          font({ size: 24, weight: "bold" }),
          foregroundStyle("white"),
        ]}
      >
        {count}
      </Text>
      <Text
        modifiers={[
          padding({ leading: 14, bottom: 12 }),
          font({ size: 15, weight: "semibold" }),
          foregroundStyle("white"),
        ]}
      >
        {name}
      </Text>
    </ZStack>
  );
};
