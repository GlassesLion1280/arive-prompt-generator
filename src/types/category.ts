import type { AIModelId } from './model';

export type MainCategoryId = 'person' | 'background' | 'texture' | 'common' | 'thumbnail';

export interface MainCategory {
  id: MainCategoryId;
  label: string;
  labelJa: string;
  order: number;
}

export interface SubCategory {
  id: string;
  mainCategoryId: MainCategoryId;
  label: string;
  labelJa: string;
  order: number;
  promptOrder: number;
  options: PromptOption[];
}

export interface PromptOption {
  id: string;
  labelJa: string;
  promptEn: string;
  promptJa?: string;
  description?: string;
  modelOverrides?: Partial<Record<AIModelId, string>>;
}

export interface SelectedOptions {
  [categoryId: string]: string[];
}

export interface GeneratedPrompt {
  main: string;
  negative?: string;
  parameters?: string;
  fullPrompt: string;
}

export interface PromptPart {
  categoryId: string;
  promptOrder: number;
  text: string;
}
