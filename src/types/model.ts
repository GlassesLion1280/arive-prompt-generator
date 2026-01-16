export type AIModelId =
  | 'midjourney'
  | 'nijijourney'
  | 'gemini'
  | 'dalle'
  | 'nanobanana'
  | 'nanobanana-thumb'
  | 'firefly';

export interface OutputFormat {
  style: 'keywords' | 'natural' | 'structured';
  separator: string;
  hasNegativePrompt: boolean;
  prefix?: string;
  suffix?: string;
  parameterFormat?: string;
}

export interface ModelFeatures {
  aspectRatio: boolean;
  negativePrompt: boolean;
  styleParameter: boolean;
  versionParameter: boolean;
  japaneseOutput: boolean;
}

export interface AIModel {
  id: AIModelId;
  name: string;
  displayName: string;
  outputFormat: OutputFormat;
  supportedFeatures: ModelFeatures;
}
