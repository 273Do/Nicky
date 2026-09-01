import { VStack } from "@expo/ui/swift-ui";
import { clipShape, frame } from "@expo/ui/swift-ui/modifiers";
import { AppleMaps } from "expo-maps";

type Props = {
  /** 緯度 */
  lat: number;
  /** 経度 */
  lng: number;
  /** タイトル */
  title: string;
};

/**
 * SwiftUI List 内で使えるインラインマップ
 */
export function InlineMapView({ lat, lng, title }: Props) {
  return (
    <VStack modifiers={[frame({ height: 200, maxWidth: 9999 }), clipShape("roundedRectangle", 12)]}>
      <AppleMaps.View
        style={{ width: "100%", height: 200 }}
        cameraPosition={{
          coordinates: { latitude: lat, longitude: lng },
          zoom: 15,
        }}
        markers={[
          {
            coordinates: { latitude: lat, longitude: lng },
            title,
          },
        ]}
      />
    </VStack>
  );
}
