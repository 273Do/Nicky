import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PlatformColor } from "react-native";

import { Button, HStack, Image, Spacer, Text, VStack } from "@expo/ui/swift-ui";
import {
  aspectRatio,
  buttonStyle,
  clipShape,
  foregroundStyle,
  frame,
  onTapGesture,
  resizable,
} from "@expo/ui/swift-ui/modifiers";
import * as ImagePicker from "expo-image-picker";

import { deleteMediaImage, getMediaImageUri, saveMediaImage } from "@/utils/entry/media-file";

import { FieldWrapper } from "./field-wrapper";

type Props = {
  /** フィールドラベル */
  label: string;
  /** デフォルト値（相対パス） */
  defaultValue?: string | null;
  /** 値変更時のコールバック */
  onValueChange?: (value: string | null) => void;
  /** 入力かどうか */
  edit?: boolean;
};

/**
 * メディアフィールド
 */
export function EntryMedia({ label, defaultValue, onValueChange, edit = false }: Props) {
  const { t } = useTranslation();
  const [imagePath, setImagePath] = useState<string | null>(defaultValue ?? null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    // 既存の画像があれば削除
    if (imagePath) {
      deleteMediaImage(imagePath);
    }

    const relativePath = saveMediaImage(result.assets[0].uri);

    setImagePath(relativePath);
    onValueChange?.(relativePath);
  };

  const removeImage = () => {
    if (imagePath) {
      deleteMediaImage(imagePath);
    }

    setImagePath(null);
    onValueChange?.(null);
  };

  if (!edit) {
    if (!imagePath) {
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
        <VStack modifiers={[frame({ maxWidth: 9999 }), clipShape("roundedRectangle", 12)]}>
          <Image
            uiImage={getMediaImageUri(imagePath)}
            modifiers={[
              resizable(),
              aspectRatio({ contentMode: "fit" }),
              frame({ maxHeight: 200, maxWidth: 9999 }),
            ]}
          />
        </VStack>
      </FieldWrapper>
    );
  }

  return (
    <FieldWrapper label={label}>
      {imagePath ? (
        <VStack alignment="leading" spacing={8}>
          <Spacer />
          <VStack
            modifiers={[
              frame({ maxWidth: 9999 }),
              clipShape("roundedRectangle", 12),
              onTapGesture(pickImage),
            ]}
          >
            <Image
              uiImage={getMediaImageUri(imagePath)}
              modifiers={[
                resizable(),
                aspectRatio({ contentMode: "fit" }),
                frame({ maxHeight: 200, maxWidth: 9999 }),
              ]}
            />
          </VStack>
          <HStack>
            <Spacer />
            <Button
              modifiers={[
                foregroundStyle({ type: "hierarchical", style: "primary" }),
                buttonStyle("bordered"),
              ]}
              onPress={removeImage}
            >
              <Image systemName="trash" color={PlatformColor("systemRed")} size={16} />
            </Button>
          </HStack>
        </VStack>
      ) : (
        <HStack>
          <Text>{t("field.media")}</Text>
          <Spacer />
          <Button modifiers={[buttonStyle("bordered")]} onPress={pickImage}>
            <Image systemName="photo.badge.plus" size={18} />
          </Button>
        </HStack>
      )}
    </FieldWrapper>
  );
}
