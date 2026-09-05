import { useEffect, useState } from "react";

import { isModelDownloaded } from "@react-native-ai/llama";

import { AI_MODEL } from "@/constants/ai-models";

/**
 * AI モデルがダウンロード済みかどうかを返すフック
 */
export function useModelDownloaded() {
  const [downloaded, setDownloaded] = useState(false);

  const refresh = () => {
    isModelDownloaded(AI_MODEL.gguf)
      .then(setDownloaded)
      .catch(() => setDownloaded(false));
  };

  useEffect(refresh, []);

  return { downloaded, refresh } as const;
}
