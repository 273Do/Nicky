import { apple } from "@react-native-ai/apple";
import { llama } from "@react-native-ai/llama";

const MODEL = process.env.EXPO_PUBLIC_REFLECTION_LLM;

/**
 * days のフィードバックに使用するプロバイダーを取得する関数
 * デフォルトでは Apple Intelligence を使用し、非対応の場合 llama を使用する。
 */
export const getReflectionModel = () => {
  // Apple Intelligence が使用可能かどうか
  const appleAvailable = apple.isAvailable();

  if (appleAvailable) {
    return apple();
  }

  // 非対応の場合は Llama を使用
  if (MODEL) {
    const model = llama.languageModel(MODEL);
    return model;
  }

  return null;
};
