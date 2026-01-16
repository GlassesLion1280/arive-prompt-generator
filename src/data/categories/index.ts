import type { MainCategory, SubCategory, MainCategoryId, AIModelId } from '../../types';
import { PERSON_CATEGORIES } from './person';
import { BACKGROUND_CATEGORIES } from './background';
import { TEXTURE_CATEGORIES } from './texture';
import { COMMON_CATEGORIES } from './common';
import { IMPRESSION_CATEGORIES } from './impression';
import { THUMBNAIL_CATEGORIES } from './thumbnail';
import { NANOBANANA_THUMBNAIL_CATEGORIES } from './nanobanana-thumbnail';

// 通常のメインカテゴリ（全モデル共通）
export const MAIN_CATEGORIES: MainCategory[] = [
  { id: 'person', label: 'Person', labelJa: '人物', order: 1 },
  { id: 'background', label: 'Background', labelJa: '背景', order: 2 },
  { id: 'texture', label: 'Texture', labelJa: 'テクスチャ', order: 3 },
  { id: 'common', label: 'Common', labelJa: '共通設定', order: 4 },
];

// Nanobanana Pro専用のサムネイルカテゴリ
export const NANOBANANA_MAIN_CATEGORY: MainCategory = {
  id: 'thumbnail',
  label: 'YouTube Thumbnail',
  labelJa: 'サムネイル',
  order: 0,
};

// モデル別のメインカテゴリを取得
export const getMainCategoriesForModel = (modelId: AIModelId): MainCategory[] => {
  if (modelId === 'nanobanana') {
    // Nanobanana Pro (画像) は通常カテゴリのみ
    return MAIN_CATEGORIES;
  }
  if (modelId === 'nanobanana-thumb') {
    // Nanobanana Pro (サムネイル) はサムネイルカテゴリのみ
    return [NANOBANANA_MAIN_CATEGORY];
  }
  return MAIN_CATEGORIES;
};

// 通常の全カテゴリ
export const ALL_CATEGORIES: SubCategory[] = [
  ...PERSON_CATEGORIES,
  ...BACKGROUND_CATEGORIES,
  ...TEXTURE_CATEGORIES,
  ...COMMON_CATEGORIES,
  ...IMPRESSION_CATEGORIES,
  ...THUMBNAIL_CATEGORIES,
  ...NANOBANANA_THUMBNAIL_CATEGORIES,
];

// メインカテゴリIDに基づいてサブカテゴリを取得
export const getCategoriesByMain = (mainId: MainCategoryId, _modelId?: AIModelId): SubCategory[] => {
  // thumbnailカテゴリの場合、Nanobanana専用カテゴリを返す
  if (mainId === 'thumbnail') {
    return NANOBANANA_THUMBNAIL_CATEGORIES.sort((a, b) => a.order - b.order);
  }

  return ALL_CATEGORIES
    .filter((cat) => cat.mainCategoryId === mainId)
    .sort((a, b) => a.order - b.order);
};

export const getCategoryById = (id: string): SubCategory | undefined => {
  return ALL_CATEGORIES.find((cat) => cat.id === id);
};

export const getOptionById = (categoryId: string, optionId: string) => {
  const category = getCategoryById(categoryId);
  if (!category) return undefined;
  return category.options.find((opt) => opt.id === optionId);
};

export {
  PERSON_CATEGORIES,
  BACKGROUND_CATEGORIES,
  TEXTURE_CATEGORIES,
  COMMON_CATEGORIES,
  IMPRESSION_CATEGORIES,
  THUMBNAIL_CATEGORIES,
  NANOBANANA_THUMBNAIL_CATEGORIES,
};
