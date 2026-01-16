import { create } from 'zustand';
import type { EffectCategory, EyeCandyEffect } from '../data/eyecandyEffects';
import { getEffectsByCategory } from '../data/eyecandyEffects';

// 適用範囲の選択
export type ApplyScope = 'all' | 'partial';

interface EyeCandyState {
  // State
  selectedEffect: EyeCandyEffect | null;
  selectedCategory: EffectCategory;
  applyScope: ApplyScope;
  partialText: string; // 一部適用の場合のテキスト
  generatedPrompt: string | null;

  // Actions
  setSelectedEffect: (effect: EyeCandyEffect | null) => void;
  setSelectedCategory: (category: EffectCategory) => void;
  setApplyScope: (scope: ApplyScope) => void;
  setPartialText: (text: string) => void;
  generatePrompt: () => void;
  resetAll: () => void;
}

export const useEyeCandyStore = create<EyeCandyState>()((set, get) => ({
  selectedEffect: null,
  selectedCategory: 'all',
  applyScope: 'all',
  partialText: '',
  generatedPrompt: null,

  setSelectedEffect: (effect) => {
    set({ selectedEffect: effect });
    // エフェクト選択時にプロンプトを自動生成
    get().generatePrompt();
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  setApplyScope: (scope) => {
    set({ applyScope: scope });
    get().generatePrompt();
  },

  setPartialText: (text) => {
    set({ partialText: text });
    get().generatePrompt();
  },

  generatePrompt: () => {
    const { selectedEffect, applyScope, partialText } = get();

    if (!selectedEffect) {
      set({ generatedPrompt: null });
      return;
    }

    let prompt = selectedEffect.prompt;

    // 一部適用の場合、Constraintsセクションにテキスト指定を追加
    if (applyScope === 'partial' && partialText.trim()) {
      const targetText = partialText.trim();
      const partialInstruction = `\n\n## Target Text Specification (部分適用指定)\n**適用対象:** 「${targetText}」という文字列のみにエフェクトを適用すること。それ以外の文字は元のスタイルを維持する。`;
      prompt += partialInstruction;
    }

    set({ generatedPrompt: prompt });
  },

  resetAll: () => {
    set({
      selectedEffect: null,
      applyScope: 'all',
      partialText: '',
      generatedPrompt: null,
    });
  },
}));

// フィルタされたエフェクトを取得するセレクター
export const useFilteredEffects = () => {
  const { selectedCategory } = useEyeCandyStore();
  return getEffectsByCategory(selectedCategory);
};
