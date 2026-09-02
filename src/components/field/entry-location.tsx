import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { HStack, Text, TextField } from "@expo/ui/swift-ui";
import { foregroundStyle, frame } from "@expo/ui/swift-ui/modifiers";
import * as Location from "expo-location";

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
export function EntryLocation({ label, defaultValue, onValueChange, edit = false }: Props) {
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

    if (!text.trim()) {
      setLocation(null);

      await onValueChange?.("");

      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // 既存の座標がある場合のみ住所テキストを即座に反映
    if (location?.lat != null && location?.lng != null) {
      const updated: LocationData = {
        address: text,
        lat: location.lat,
        lng: location.lng,
      };

      await onValueChange?.(JSON.stringify(updated));
    }
    // 500ms 後にジオコーディングして座標を確定
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await geocode(text);
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
}
