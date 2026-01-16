import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIModelId, MainCategoryId, SelectedOptions, GeneratedPrompt } from '../types';
import { generatePrompt } from '../utils/promptBuilder';
import { getCategoryById } from '../data/categories';

export type OutputLanguage = 'en' | 'ja';

// 画像出力枚数（1以上の整数）
export type ImageCount = number;

// テキスト位置の選択肢
export type TextVerticalPosition = 'top' | 'center' | 'bottom';
export type TextHorizontalPosition = 'left' | 'center' | 'right';

// 各テキスト行の設定
export interface ThumbnailTextLine {
  text: string;
  verticalPosition: TextVerticalPosition;
  horizontalPosition: TextHorizontalPosition;
}

// サムネイルテキスト設定
export interface ThumbnailTextConfig {
  lines: ThumbnailTextLine[];  // 各行のテキストと位置
  lineCount: 1 | 2 | 3;  // 行数
}

interface PromptState {
  // State
  selectedModel: AIModelId;
  selectedOptions: SelectedOptions;
  generatedPrompt: GeneratedPrompt | null;
  activeMainCategory: MainCategoryId;
  expandedSubCategories: string[];
  outputLanguage: OutputLanguage;
  freeText: string;
  showNegativePrompt: boolean;
  thumbnailText: ThumbnailTextConfig;  // サムネイル用テキスト
  imageCount: ImageCount;  // 画像出力枚数

  // Actions
  setSelectedModel: (model: AIModelId) => void;
  toggleOption: (categoryId: string, optionId: string) => void;
  setActiveMainCategory: (category: MainCategoryId) => void;
  toggleSubCategory: (categoryId: string) => void;
  resetAllSelections: () => void;
  resetCategorySelections: (categoryId: string) => void;
  setOutputLanguage: (lang: OutputLanguage) => void;
  setFreeText: (text: string) => void;
  setShowNegativePrompt: (show: boolean) => void;
  setThumbnailText: (config: ThumbnailTextConfig) => void;  // サムネイルテキスト設定
  setImageCount: (count: ImageCount) => void;  // 画像出力枚数設定
  loadFromFavorite: (preset: {
    selectedModel: AIModelId;
    selectedOptions: SelectedOptions;
    outputLanguage: OutputLanguage;
    freeText: string;
    showNegativePrompt: boolean;
    thumbnailText?: ThumbnailTextConfig;
  }) => void;
  mergeOptions: (options: SelectedOptions) => void;
}

const createDefaultLine = (): ThumbnailTextLine => ({
  text: '',
  verticalPosition: 'center',
  horizontalPosition: 'center',
});

const defaultThumbnailText: ThumbnailTextConfig = {
  lines: [createDefaultLine(), createDefaultLine(), createDefaultLine()],
  lineCount: 1,
};

// 古い形式のデータを新しい形式に変換する関数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const migrateThumbnailText = (data: any): ThumbnailTextConfig => {
  if (!data || !data.lines) {
    return defaultThumbnailText;
  }

  // 既に新しい形式の場合はそのまま返す
  if (data.lines[0] && typeof data.lines[0] === 'object' && 'text' in data.lines[0]) {
    return data as ThumbnailTextConfig;
  }

  // 古い形式（string[]）から新しい形式に変換
  if (Array.isArray(data.lines) && (data.lines.length === 0 || typeof data.lines[0] === 'string')) {
    const oldLines = data.lines as string[];
    return {
      lines: [
        { text: oldLines[0] || '', verticalPosition: 'center', horizontalPosition: 'center' },
        { text: oldLines[1] || '', verticalPosition: 'center', horizontalPosition: 'center' },
        { text: oldLines[2] || '', verticalPosition: 'center', horizontalPosition: 'center' },
      ],
      lineCount: data.lineCount || 1,
    };
  }

  return defaultThumbnailText;
};

const regeneratePrompt = (state: Partial<PromptState> & Pick<PromptState, 'selectedModel' | 'selectedOptions' | 'outputLanguage' | 'freeText' | 'showNegativePrompt'> & { thumbnailText?: ThumbnailTextConfig }) => {
  return generatePrompt(
    state.selectedModel,
    state.selectedOptions,
    state.outputLanguage,
    state.freeText,
    state.showNegativePrompt,
    state.thumbnailText ?? defaultThumbnailText
  );
};

export const usePromptStore = create<PromptState>()(
  persist(
    (set, get) => ({
      selectedModel: 'midjourney',
      selectedOptions: {},
      generatedPrompt: null,
      activeMainCategory: 'person',
      expandedSubCategories: [],
      outputLanguage: 'en',
      freeText: '',
      showNegativePrompt: false,
      thumbnailText: defaultThumbnailText,
      imageCount: 1,

      setSelectedModel: (model) => {
        const state = get();
        // 共通設定（common）カテゴリの選択は保持する
        const preservedOptions: SelectedOptions = {};
        for (const [categoryId, optionIds] of Object.entries(state.selectedOptions)) {
          const category = getCategoryById(categoryId);
          if (category?.mainCategoryId === 'common') {
            preservedOptions[categoryId] = optionIds;
          }
        }

        const newPrompt = regeneratePrompt({ ...state, selectedModel: model, selectedOptions: preservedOptions });
        set({
          selectedModel: model,
          selectedOptions: preservedOptions,
          generatedPrompt: newPrompt,
        });
      },

      toggleOption: (categoryId, optionId) => {
        const state = get();
        const currentSelected = state.selectedOptions[categoryId] || [];

        const newSelected = currentSelected.includes(optionId)
          ? currentSelected.filter((id) => id !== optionId)
          : [...currentSelected, optionId];

        const newOptions = {
          ...state.selectedOptions,
          [categoryId]: newSelected,
        };

        if (newSelected.length === 0) {
          delete newOptions[categoryId];
        }

        const newPrompt = regeneratePrompt({ ...state, selectedOptions: newOptions });

        set({
          selectedOptions: newOptions,
          generatedPrompt: newPrompt,
        });
      },

      setActiveMainCategory: (category) => {
        set({ activeMainCategory: category });
      },

      toggleSubCategory: (categoryId) => {
        const { expandedSubCategories } = get();
        const isExpanded = expandedSubCategories.includes(categoryId);

        set({
          expandedSubCategories: isExpanded
            ? expandedSubCategories.filter((id) => id !== categoryId)
            : [...expandedSubCategories, categoryId],
        });
      },

      resetAllSelections: () => {
        const state = get();
        // 共通設定（common）カテゴリの選択は保持する
        const preservedOptions: SelectedOptions = {};
        for (const [categoryId, optionIds] of Object.entries(state.selectedOptions)) {
          const category = getCategoryById(categoryId);
          if (category?.mainCategoryId === 'common') {
            preservedOptions[categoryId] = optionIds;
          }
        }

        const newPrompt = regeneratePrompt({
          ...state,
          selectedOptions: preservedOptions,
          freeText: '',
        });

        set({
          selectedOptions: preservedOptions,
          generatedPrompt: newPrompt,
          freeText: '',
        });
      },

      resetCategorySelections: (categoryId) => {
        const state = get();
        const newOptions = { ...state.selectedOptions };
        delete newOptions[categoryId];

        const newPrompt = regeneratePrompt({ ...state, selectedOptions: newOptions });

        set({
          selectedOptions: newOptions,
          generatedPrompt: newPrompt,
        });
      },

      setOutputLanguage: (lang) => {
        const state = get();
        const newPrompt = regeneratePrompt({ ...state, outputLanguage: lang });
        set({
          outputLanguage: lang,
          generatedPrompt: newPrompt,
        });
      },

      setFreeText: (text) => {
        const state = get();
        const newPrompt = regeneratePrompt({ ...state, freeText: text });
        set({
          freeText: text,
          generatedPrompt: newPrompt,
        });
      },

      setShowNegativePrompt: (show) => {
        const state = get();
        const newPrompt = regeneratePrompt({ ...state, showNegativePrompt: show });
        set({
          showNegativePrompt: show,
          generatedPrompt: newPrompt,
        });
      },

      setImageCount: (count) => {
        set({ imageCount: count });
        // 画像枚数はプロンプト生成には影響しない（UI表示のみ）
      },

      setThumbnailText: (config) => {
        const state = get();
        const newPrompt = regeneratePrompt({ ...state, thumbnailText: config });
        set({
          thumbnailText: config,
          generatedPrompt: newPrompt,
        });
      },

      loadFromFavorite: (preset) => {
        const newPrompt = regeneratePrompt({
          ...preset,
          thumbnailText: preset.thumbnailText ?? defaultThumbnailText,
        });
        set({
          selectedModel: preset.selectedModel,
          selectedOptions: preset.selectedOptions,
          outputLanguage: preset.outputLanguage,
          freeText: preset.freeText,
          showNegativePrompt: preset.showNegativePrompt,
          thumbnailText: preset.thumbnailText ?? defaultThumbnailText,
          generatedPrompt: newPrompt,
        });
      },

      mergeOptions: (options) => {
        const state = get();
        // 現在の選択オプションに新しいオプションをマージ
        const mergedOptions = { ...state.selectedOptions };
        for (const [categoryId, optionIds] of Object.entries(options)) {
          if (optionIds && optionIds.length > 0) {
            mergedOptions[categoryId] = optionIds;
          }
        }

        const newPrompt = regeneratePrompt({ ...state, selectedOptions: mergedOptions });

        set({
          selectedOptions: mergedOptions,
          generatedPrompt: newPrompt,
        });
      },
    }),
    {
      name: 'arive-prompt-storage',
      partialize: (state) => ({
        selectedModel: state.selectedModel,
        selectedOptions: state.selectedOptions,
        expandedSubCategories: state.expandedSubCategories,
        activeMainCategory: state.activeMainCategory,
        outputLanguage: state.outputLanguage,
        showNegativePrompt: state.showNegativePrompt,
        freeText: state.freeText,
        thumbnailText: state.thumbnailText,
        imageCount: state.imageCount,
      }),
      onRehydrateStorage: () => (state) => {
        // ストレージから復元後、データをマイグレーションしてプロンプトを再生成
        if (state) {
          // 古い形式のthumbnailTextを新しい形式にマイグレーション
          const migratedThumbnailText = migrateThumbnailText(state.thumbnailText);
          state.thumbnailText = migratedThumbnailText;

          // モデルとカテゴリの整合性チェック
          // nanobanana (画像) で thumbnail カテゴリが選択されていたら person に戻す
          if (state.selectedModel === 'nanobanana' && state.activeMainCategory === 'thumbnail') {
            state.activeMainCategory = 'person';
          }
          // nanobanana-thumb で thumbnail 以外が選択されていたら thumbnail にする
          if (state.selectedModel === 'nanobanana-thumb' && state.activeMainCategory !== 'thumbnail') {
            state.activeMainCategory = 'thumbnail';
          }

          const newPrompt = generatePrompt(
            state.selectedModel,
            state.selectedOptions,
            state.outputLanguage,
            state.freeText,
            state.showNegativePrompt,
            migratedThumbnailText
          );
          state.generatedPrompt = newPrompt;
        }
      },
    }
  )
);
