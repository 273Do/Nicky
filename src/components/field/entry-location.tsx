import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { HStack, Text, TextField, VStack } from "@expo/ui/swift-ui";
import { clipShape, foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";
import * as Location from "expo-location";
import { AppleMaps } from "expo-maps";

import { type LocationData, parseLocation } from "@/utils/entry/field-value";

import { FieldWrapper } from "./field-wrapper";

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
export const EntryLocation = ({ label, defaultValue, onValueChange, edit = false }: Props) => {
  const { t } = useTranslation();
  const [location, setLocation] = useState<LocationData | null>(() => parseLocation(defaultValue));
  const [address, setAddress] = useState(location?.address ?? "");
  const mountedRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const geocode = async (text: string) => {
    const results = await Location.geocodeAsync(text);

    if (!mountedRef.current) return;

    if (results.length > 0) {
      const data: LocationData = {
        address: text,
        lat: results[0].latitude,
        lng: results[0].longitude,
      };
      setLocation(data);

      await onValueChange?.(JSON.stringify(data));
    }
  };

  const handleTextChange = async (text: string) => {
    setAddress(text);

    // 即座に住所テキストだけ親に反映（既存の座標を保持）
    const updated: LocationData = {
      address: text,
      lat: location?.lat ?? 0,
      lng: location?.lng ?? 0,
    };

    await onValueChange?.(JSON.stringify(updated));
    // 500ms 後にジオコーディングして座標を確定
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      if (text.trim()) await geocode(text);
    }, 500);
  };

  if (!edit) {
    if (!location) {
      return (
        <FieldWrapper label={label}>
          <HStack spacing={6}>
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
        onValueChange={handleTextChange}
        modifiers={[frame({ maxWidth: 9999 })]}
      />
    </FieldWrapper>
  );
};

/**
 * SwiftUI List 内で使えるインラインマップ
 */
export const InlineMapView = ({ lat, lng, title }: { lat: number; lng: number; title: string }) => {
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
};
