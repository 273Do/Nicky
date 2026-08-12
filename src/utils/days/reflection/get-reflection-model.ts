import { downloadModel, llama } from "@react-native-ai/llama";

const MODEL = process.env.EXPO_PUBLIC_REFLECTION_LLM;

/**
 * days の振り返りに使用する llama モデルを取得する
 */
export const getReflectionModel = async () => {
  if (!MODEL) return null;

  const modelPath = await downloadModel(MODEL);
  const model = llama.languageModel(modelPath);

  await model.prepare();

  return model;
};
