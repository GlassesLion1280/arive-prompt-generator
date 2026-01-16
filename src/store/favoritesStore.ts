import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AIModelId, SelectedOptions } from '../types';
import type { OutputLanguage } from './promptStore';

export interface FavoritePreset {
  id: string;
  name: string;
  createdAt: number;
  selectedModel: AIModelId;
  selectedOptions: SelectedOptions;
  outputLanguage: OutputLanguage;
  freeText: string;
  showNegativePrompt: boolean;
}

interface FavoritesState {
  favorites: FavoritePreset[];
  addFavorite: (preset: Omit<FavoritePreset, 'id' | 'createdAt'>) => void;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, name: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (preset) => {
        const newFavorite: FavoritePreset = {
          ...preset,
          id: `fav-${Date.now()}`,
          createdAt: Date.now(),
        };
        set({ favorites: [...get().favorites, newFavorite] });
      },

      removeFavorite: (id) => {
        set({ favorites: get().favorites.filter((f) => f.id !== id) });
      },

      renameFavorite: (id, name) => {
        set({
          favorites: get().favorites.map((f) =>
            f.id === id ? { ...f, name } : f
          ),
        });
      },
    }),
    {
      name: 'arive-favorites-storage',
    }
  )
);
