import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GachaState {
  // 除外オプション: { categoryId: [optionId, ...] }
  excludedOptions: Record<string, string[]>;

  // Actions
  toggleExclude: (categoryId: string, optionId: string) => void;
  isExcluded: (categoryId: string, optionId: string) => boolean;
  clearAllExclusions: () => void;
  clearCategoryExclusions: (categoryId: string) => void;
  getExcludedCount: () => number;
  getExcludedSet: () => Set<string>; // runGachaに渡す用
}

export const useGachaStore = create<GachaState>()(
  persist(
    (set, get) => ({
      excludedOptions: {},

      toggleExclude: (categoryId, optionId) => {
        const current = get().excludedOptions;
        const categoryExclusions = current[categoryId] || [];
        const isCurrentlyExcluded = categoryExclusions.includes(optionId);

        if (isCurrentlyExcluded) {
          // 除外解除
          const newCategoryExclusions = categoryExclusions.filter((id) => id !== optionId);
          if (newCategoryExclusions.length === 0) {
            const { [categoryId]: _, ...rest } = current;
            set({ excludedOptions: rest });
          } else {
            set({
              excludedOptions: {
                ...current,
                [categoryId]: newCategoryExclusions,
              },
            });
          }
        } else {
          // 除外追加
          set({
            excludedOptions: {
              ...current,
              [categoryId]: [...categoryExclusions, optionId],
            },
          });
        }
      },

      isExcluded: (categoryId, optionId) => {
        return get().excludedOptions[categoryId]?.includes(optionId) ?? false;
      },

      clearAllExclusions: () => {
        set({ excludedOptions: {} });
      },

      clearCategoryExclusions: (categoryId) => {
        const { [categoryId]: _, ...rest } = get().excludedOptions;
        set({ excludedOptions: rest });
      },

      getExcludedCount: () => {
        let count = 0;
        for (const optIds of Object.values(get().excludedOptions)) {
          count += optIds.length;
        }
        return count;
      },

      getExcludedSet: () => {
        const result = new Set<string>();
        for (const [catId, optIds] of Object.entries(get().excludedOptions)) {
          for (const optId of optIds) {
            result.add(`${catId}:${optId}`);
          }
        }
        return result;
      },
    }),
    {
      name: 'arive-gacha-exclusions',
    }
  )
);
