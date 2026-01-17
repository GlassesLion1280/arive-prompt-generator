import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIModelId, SelectedOptions } from '../types';
import type { OutputLanguage, ThumbnailTextConfig } from './promptStore';

// プロンプト生成の履歴アイテム
export interface PromptHistoryItem {
  id: string;
  createdAt: number;
  selectedModel: AIModelId;
  selectedOptions: SelectedOptions;
  outputLanguage: OutputLanguage;
  freeText: string;
  showNegativePrompt: boolean;
  thumbnailText?: ThumbnailTextConfig;
  fullPrompt: string;
}

// ギラギラくんの履歴アイテム
export interface GiraGiraHistoryItem {
  id: string;
  createdAt: number;
  effectId: string;
  effectTitleJa: string;
  applyScope: 'all' | 'partial';
  partialText: string;
  fullPrompt: string;
}

const MAX_HISTORY_ITEMS = 30;

interface HistoryState {
  // プロンプト生成履歴
  promptHistory: PromptHistoryItem[];
  addPromptHistory: (item: Omit<PromptHistoryItem, 'id' | 'createdAt'>) => void;
  removePromptHistory: (id: string) => void;
  clearPromptHistory: () => void;

  // ギラギラくん履歴
  giraGiraHistory: GiraGiraHistoryItem[];
  addGiraGiraHistory: (item: Omit<GiraGiraHistoryItem, 'id' | 'createdAt'>) => void;
  removeGiraGiraHistory: (id: string) => void;
  clearGiraGiraHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      promptHistory: [],
      giraGiraHistory: [],

      addPromptHistory: (item) => {
        const newItem: PromptHistoryItem = {
          ...item,
          id: `ph-${Date.now()}`,
          createdAt: Date.now(),
        };
        const history = [newItem, ...get().promptHistory];
        // 30件を超えたら古いものを削除
        if (history.length > MAX_HISTORY_ITEMS) {
          history.splice(MAX_HISTORY_ITEMS);
        }
        set({ promptHistory: history });
      },

      removePromptHistory: (id) => {
        set({ promptHistory: get().promptHistory.filter((h) => h.id !== id) });
      },

      clearPromptHistory: () => {
        set({ promptHistory: [] });
      },

      addGiraGiraHistory: (item) => {
        const newItem: GiraGiraHistoryItem = {
          ...item,
          id: `gh-${Date.now()}`,
          createdAt: Date.now(),
        };
        const history = [newItem, ...get().giraGiraHistory];
        // 30件を超えたら古いものを削除
        if (history.length > MAX_HISTORY_ITEMS) {
          history.splice(MAX_HISTORY_ITEMS);
        }
        set({ giraGiraHistory: history });
      },

      removeGiraGiraHistory: (id) => {
        set({ giraGiraHistory: get().giraGiraHistory.filter((h) => h.id !== id) });
      },

      clearGiraGiraHistory: () => {
        set({ giraGiraHistory: [] });
      },
    }),
    {
      name: 'arive-history-storage',
    }
  )
);
