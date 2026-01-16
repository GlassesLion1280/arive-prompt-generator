import type { AIModel, AIModelId } from '../types';

// モデルグループ定義
export type ModelGroupId = 'general' | 'nanobanana' | 'other';

export interface ModelGroup {
  id: ModelGroupId;
  label: string;
  description: string;
  modelIds: AIModelId[];
}

export const MODEL_GROUPS: ModelGroup[] = [
  {
    id: 'general',
    label: '一般画像生成',
    description: 'Midjourney、DALL-E など',
    modelIds: ['midjourney', 'nijijourney', 'gemini', 'dalle'],
  },
  {
    id: 'nanobanana',
    label: 'Nanobanana Pro',
    description: 'サムネイル特化・日本語対応',
    modelIds: ['nanobanana', 'nanobanana-thumb'],
  },
  {
    id: 'other',
    label: 'その他',
    description: 'Adobe Firefly',
    modelIds: ['firefly'],
  },
];

export const AI_MODELS: AIModel[] = [
  {
    id: 'midjourney',
    name: 'Midjourney',
    displayName: 'Midjourney',
    outputFormat: {
      style: 'keywords',
      separator: ', ',
      hasNegativePrompt: true,
      parameterFormat: '--ar {aspectRatio}',
    },
    supportedFeatures: {
      aspectRatio: true,
      negativePrompt: true,
      styleParameter: true,
      versionParameter: false,
      japaneseOutput: false,
    },
  },
  {
    id: 'nijijourney',
    name: 'nijijourney',
    displayName: 'nijijourney',
    outputFormat: {
      style: 'structured',
      separator: ', ',
      hasNegativePrompt: true,
      prefix: 'is_anime_or_oriental_aesthetic_style: true\n',
      suffix: ' --v 7',
    },
    supportedFeatures: {
      aspectRatio: true,
      negativePrompt: true,
      styleParameter: false,
      versionParameter: true,
      japaneseOutput: false,
    },
  },
  {
    id: 'gemini',
    name: 'Gemini Imagen',
    displayName: 'Gemini Imagen',
    outputFormat: {
      style: 'natural',
      separator: ', ',
      hasNegativePrompt: false,
    },
    supportedFeatures: {
      aspectRatio: true,
      negativePrompt: false,
      styleParameter: false,
      versionParameter: false,
      japaneseOutput: false,
    },
  },
  {
    id: 'dalle',
    name: 'ChatGPT DALL-E',
    displayName: 'DALL-E',
    outputFormat: {
      style: 'natural',
      separator: ', ',
      hasNegativePrompt: false,
    },
    supportedFeatures: {
      aspectRatio: true,
      negativePrompt: false,
      styleParameter: false,
      versionParameter: false,
      japaneseOutput: false,
    },
  },
  {
    id: 'nanobanana',
    name: 'Nanobanana Pro',
    displayName: 'Nanobanana Pro (画像)',
    outputFormat: {
      style: 'natural',
      separator: ', ',
      hasNegativePrompt: true,
    },
    supportedFeatures: {
      aspectRatio: true,
      negativePrompt: true,
      styleParameter: false,
      versionParameter: false,
      japaneseOutput: true,
    },
  },
  {
    id: 'nanobanana-thumb',
    name: 'Nanobanana Pro',
    displayName: 'Nanobanana Pro (サムネイル)',
    outputFormat: {
      style: 'natural',
      separator: ', ',
      hasNegativePrompt: true,
    },
    supportedFeatures: {
      aspectRatio: true,
      negativePrompt: true,
      styleParameter: false,
      versionParameter: false,
      japaneseOutput: true,
    },
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    displayName: 'Adobe Firefly',
    outputFormat: {
      style: 'keywords',
      separator: ', ',
      hasNegativePrompt: false,
    },
    supportedFeatures: {
      aspectRatio: true,
      negativePrompt: false,
      styleParameter: false,
      versionParameter: false,
      japaneseOutput: false,
    },
  },
];

export const getModelById = (id: string): AIModel | undefined => {
  return AI_MODELS.find((model) => model.id === id);
};
