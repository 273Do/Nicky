import { apple } from "@react-native-ai/apple";
import { downloadModel, llama } from "@react-native-ai/llama";

const MODEL = process.env.EXPO_PUBLIC_REFLECTION_LLM;

/**
 * days のフィードバックに使用するプロバイダーを取得する関数
 * デフォルトでは Apple Intelligence を使用し、非対応の場合 llama を使用する。
 */
export const getReflectionModel = async () => {
  // Apple Intelligence が使用可能かどうか
  const appleAvailable = apple.isAvailable();

  if (appleAvailable) {
    return apple();
  }

  // 非対応の場合は Llama を使用
  if (MODEL) {
    const modelPath = await downloadModel(MODEL);

    const model = llama.languageModel(modelPath);

    await model.prepare();

    return model;
  }

  return null;
};
