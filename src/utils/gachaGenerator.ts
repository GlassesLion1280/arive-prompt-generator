import type { SelectedOptions } from '../types';
import { PERSON_CATEGORIES } from '../data/categories/person';
import { BACKGROUND_CATEGORIES } from '../data/categories/background';
import { TEXTURE_CATEGORIES } from '../data/categories/texture';

export type GachaMode = 'person' | 'background' | 'texture';

// ガチャで使用するカテゴリの設定
const GACHA_CONFIG = {
  person: {
    // 必須カテゴリ（必ず1つ選ぶ）
    required: ['gender-count', 'age', 'shot-size', 'clothing-genre'],
    // オプショナルカテゴリ（ランダムで選ぶ）
    optional: ['hairstyle', 'hair-color', 'clothing-color', 'pose', 'gaze', 'body-type', 'accessory'],
    // オプショナルから選ぶ数
    optionalCount: 3,
    categories: PERSON_CATEGORIES,
  },
  background: {
    required: ['bg-type'],
    optional: [
      'bg-color',
      'bg-indoor',
      'bg-indoor-style',
      'bg-outdoor-urban',
      'bg-building',
      'bg-nature',
      'bg-water',
      'bg-sky',
      'bg-weather',
      'bg-time',
      'bg-lighting',
      'bg-atmosphere',
      'bg-season',
    ],
    optionalCount: 4,
    categories: BACKGROUND_CATEGORIES,
  },
  texture: {
    required: [],
    optional: [
      'texture-material',
      'texture-material-soft',
      'texture-material-metal',
      'texture-material-other',
      'texture-nature',
      'texture-pattern',
      'texture-pattern-geo',
      'texture-pattern-decorative',
      'texture-pattern-japanese',
      'texture-effect',
      'texture-surface',
      'texture-light',
      'texture-abstract',
    ],
    optionalCount: 3,
    categories: TEXTURE_CATEGORIES,
  },
};

// 配列からランダムに1つ選ぶ
function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// 配列からランダムにn個選ぶ（重複なし）
function pickRandomMultiple<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

// ガチャを実行してSelectedOptionsを生成
// lockedOptions: 固定するオプション（これらのカテゴリはガチャで変更されない）
export function runGacha(mode: GachaMode, lockedOptions?: SelectedOptions): SelectedOptions {
  const config = GACHA_CONFIG[mode];
  const result: SelectedOptions = {};

  // 固定されているカテゴリIDのセット
  const lockedCategoryIds = new Set(Object.keys(lockedOptions || {}));

  // 必須カテゴリから選択（ただし固定されている場合はスキップ）
  for (const categoryId of config.required) {
    if (lockedCategoryIds.has(categoryId)) {
      // 固定されているのでスキップ（後でlockedOptionsからコピー）
      continue;
    }
    const category = config.categories.find((c) => c.id === categoryId);
    if (category && category.options.length > 0) {
      const option = pickRandom(category.options);
      result[categoryId] = [option.id];
    }
  }

  // オプショナルカテゴリからランダムに選択（固定されていないものだけ）
  const availableOptional = config.optional.filter((catId) => !lockedCategoryIds.has(catId));
  const selectedOptionalCategories = pickRandomMultiple(availableOptional, config.optionalCount);

  for (const categoryId of selectedOptionalCategories) {
    const category = config.categories.find((c) => c.id === categoryId);
    if (category && category.options.length > 0) {
      const option = pickRandom(category.options);
      result[categoryId] = [option.id];
    }
  }

  // 固定オプションをマージ（固定が優先）
  if (lockedOptions) {
    for (const [categoryId, optionIds] of Object.entries(lockedOptions)) {
      result[categoryId] = optionIds;
    }
  }

  return result;
}

// モードに応じた日本語ラベルを取得
export function getGachaModeLabel(mode: GachaMode): string {
  switch (mode) {
    case 'person':
      return '人物';
    case 'background':
      return '背景素材';
    case 'texture':
      return 'テクスチャ';
  }
}

// モードに応じたアイコンを取得
export function getGachaModeIcon(mode: GachaMode): string {
  switch (mode) {
    case 'person':
      return '👤';
    case 'background':
      return '🌄';
    case 'texture':
      return '🎨';
  }
}
