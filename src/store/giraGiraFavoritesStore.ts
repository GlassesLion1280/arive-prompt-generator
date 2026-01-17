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

// 最終仕上げのお気に入りアイテム
export interface FinishingFavorite {
  id: string;
  name: string;
  createdAt: number;
  effectId: string;
  effectTitleJa: string;
  applyScope: 'all' | 'partial';
  partialText: string;
}

// 図解テンプレートのお気に入りアイテム
export interface DiagramFavorite {
  id: string;
  name: string;
  createdAt: number;
  templateId: string;
  templateLabelJa: string;
  titleText: string;
  subText: string;
  contentText: string;
}

interface GiraGiraFavoritesState {
  // ギラギラくんお気に入り
  favorites: GiraGiraFavorite[];
  addFavorite: (item: Omit<GiraGiraFavorite, 'id' | 'createdAt'>) => void;
  removeFavorite: (id: string) => void;
  renameFavorite: (id: string, name: string) => void;

  // 最終仕上げお気に入り
  finishingFavorites: FinishingFavorite[];
  addFinishingFavorite: (item: Omit<FinishingFavorite, 'id' | 'createdAt'>) => void;
  removeFinishingFavorite: (id: string) => void;
  renameFinishingFavorite: (id: string, name: string) => void;

  // 図解テンプレートお気に入り
  diagramFavorites: DiagramFavorite[];
  addDiagramFavorite: (item: Omit<DiagramFavorite, 'id' | 'createdAt'>) => void;
  removeDiagramFavorite: (id: string) => void;
  renameDiagramFavorite: (id: string, name: string) => void;
}

export const useGiraGiraFavoritesStore = create<GiraGiraFavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      finishingFavorites: [],
      diagramFavorites: [],

      // ギラギラくんお気に入り
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

      // 最終仕上げお気に入り
      addFinishingFavorite: (item) => {
        const newFavorite: FinishingFavorite = {
          ...item,
          id: `ff-${Date.now()}`,
          createdAt: Date.now(),
        };
        set({ finishingFavorites: [...get().finishingFavorites, newFavorite] });
      },

      removeFinishingFavorite: (id) => {
        set({ finishingFavorites: get().finishingFavorites.filter((f) => f.id !== id) });
      },

      renameFinishingFavorite: (id, name) => {
        set({
          finishingFavorites: get().finishingFavorites.map((f) =>
            f.id === id ? { ...f, name } : f
          ),
        });
      },

      // 図解テンプレートお気に入り
      addDiagramFavorite: (item) => {
        const newFavorite: DiagramFavorite = {
          ...item,
          id: `df-${Date.now()}`,
          createdAt: Date.now(),
        };
        set({ diagramFavorites: [...get().diagramFavorites, newFavorite] });
      },

      removeDiagramFavorite: (id) => {
        set({ diagramFavorites: get().diagramFavorites.filter((f) => f.id !== id) });
      },

      renameDiagramFavorite: (id, name) => {
        set({
          diagramFavorites: get().diagramFavorites.map((f) =>
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
