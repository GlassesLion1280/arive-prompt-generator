import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ギラギラくんのお気に入りアイテム
export interface GiraGiraFavorite {
  id: string;
  name: string;
  createdAt: number;
  effectId: string;
  effectTitleJa: string;
  applyScope: 'all' | 'partial';
  partialText: string;
}

interface GiraGiraFavoritesState {
  favorites: GiraGiraFavorite[];
  addFavorite: (item: Omit<GiraGiraFavorite, 'id' | 'createdAt'>) => void;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, name: string) => void;
}

export const useGiraGiraFavoritesStore = create<GiraGiraFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (item) => {
        const newFavorite: GiraGiraFavorite = {
          ...item,
          id: `gf-${Date.now()}`,
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
      name: 'arive-giragira-favorites-storage',
    }
  )
);
