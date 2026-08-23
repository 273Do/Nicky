import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { HStack, Image, Text, TextField, VStack } from "@expo/ui/swift-ui";
import { clipShape, foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";
import * as Location from "expo-location";
import { AppleMaps } from "expo-maps";

import { FieldWrapper } from "./field-wrapper";

export { InlineMapView, parseLocation, type LocationData };

/** 位置情報の JSON 構造 */
type LocationData = {
  address: string;
  lat: number;
  lng: number;
};

/** JSON 文字列をパースして LocationData を返す */
const parseLocation = (value: string | undefined): LocationData | null => {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    if (parsed.address && typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return parsed as LocationData;
    }
    return null;
  } catch {
    return null;
  }
};

type Props = {
  /** フィールドラベル */
  label: string;
  /** デフォルト値（JSON文字列） */
  defaultValue?: string;
  /** 値変更時のコールバック */
  onValueChange?: (value: string) => void | Promise<void>;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * 位置情報フィールド
 */
export function EntryLocation({ label, defaultValue, onValueChange, edit = false }: Props) {
  const { t } = useTranslation();
  const [location, setLocation] = useState<LocationData | null>(() => parseLocation(defaultValue));
  const [address, setAddress] = useState(location?.address ?? "");

  const updateLocation = (data: LocationData) => {
    setLocation(data);
    setAddress(data.address);
    onValueChange?.(JSON.stringify(data));
  };

  const handleAddressSubmit = async (text: string) => {
    if (!text.trim()) return;
    const results = await Location.geocodeAsync(text);
    if (results.length > 0) {
      updateLocation({
        address: text,
        lat: results[0].latitude,
        lng: results[0].longitude,
      });
    }
  };

  if (!edit) {
    if (!location) {
      return (
        <FieldWrapper label={label}>
          <HStack spacing={6}>
            <Image
              systemName="mappin.and.ellipse"
              color={PlatformColor("tertiaryLabel")}
              size={16}
            />
            <Text modifiers={[foregroundStyle({ type: "hierarchical", style: "tertiary" })]}>
              {t("field.notSet")}
            </Text>
          </HStack>
        </FieldWrapper>
      );
    }

    return (
      <FieldWrapper label={label}>
        <HStack spacing={6}>
          <Image systemName="mappin.and.ellipse" color={PlatformColor("systemIndigo")} size={16} />
          <Text>{location.address}</Text>
        </HStack>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper label={label}>
      <TextField
        placeholder={t("field.location")}
        defaultValue={address}
        onValueChange={setAddress}
        onFocusChange={(focused) => {
          if (!focused && address) handleAddressSubmit(address);
        }}
        modifiers={[frame({ maxWidth: 9999 })]}
      />
    </FieldWrapper>
  );
}

/**
 * SwiftUI List 内で使えるインラインマップ
 */
function InlineMapView({ lat, lng, title }: { lat: number; lng: number; title: string }) {
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
