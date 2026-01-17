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

// 最終仕上げの履歴アイテム
export interface FinishingHistoryItem {
  id: string;
  createdAt: number;
  effectId: string;
  effectTitleJa: string;
  applyScope: 'all' | 'partial';
  partialText: string;
  fullPrompt: string;
}

// 図解テンプレートの履歴アイテム
export interface DiagramHistoryItem {
  id: string;
  createdAt: number;
  templateId: string;
  templateLabelJa: string;
  titleText: string;
  subText: string;
  contentText: string;
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

  // 最終仕上げ履歴
  finishingHistory: FinishingHistoryItem[];
  addFinishingHistory: (item: Omit<FinishingHistoryItem, 'id' | 'createdAt'>) => void;
  removeFinishingHistory: (id: string) => void;
  clearFinishingHistory: () => void;

  // 図解テンプレート履歴
  diagramHistory: DiagramHistoryItem[];
  addDiagramHistory: (item: Omit<DiagramHistoryItem, 'id' | 'createdAt'>) => void;
  removeDiagramHistory: (id: string) => void;
  clearDiagramHistory: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      promptHistory: [],
      giraGiraHistory: [],
      finishingHistory: [],
      diagramHistory: [],

      addPromptHistory: (item) => {
        const newItem: PromptHistoryItem = {
          ...item,
          id: `ph-${Date.now()}`,
          createdAt: Date.now(),
        };
        const history = [newItem, ...get().promptHistory];
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

      addFinishingHistory: (item) => {
        const newItem: FinishingHistoryItem = {
          ...item,
          id: `fh-${Date.now()}`,
          createdAt: Date.now(),
        };
        const history = [newItem, ...get().finishingHistory];
        if (history.length > MAX_HISTORY_ITEMS) {
          history.splice(MAX_HISTORY_ITEMS);
        }
        set({ finishingHistory: history });
      },

      removeFinishingHistory: (id) => {
        set({ finishingHistory: get().finishingHistory.filter((h) => h.id !== id) });
      },

      clearFinishingHistory: () => {
        set({ finishingHistory: [] });
      },

      addDiagramHistory: (item) => {
        const newItem: DiagramHistoryItem = {
          ...item,
          id: `dh-${Date.now()}`,
          createdAt: Date.now(),
        };
        const history = [newItem, ...get().diagramHistory];
        if (history.length > MAX_HISTORY_ITEMS) {
          history.splice(MAX_HISTORY_ITEMS);
        }
        set({ diagramHistory: history });
      },

      removeDiagramHistory: (id) => {
        set({ diagramHistory: get().diagramHistory.filter((h) => h.id !== id) });
      },

      clearDiagramHistory: () => {
        set({ diagramHistory: [] });
      },
    }),
    {
      name: 'arive-history-storage',
    }
  )
);
