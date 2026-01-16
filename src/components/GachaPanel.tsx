import { useState } from 'react';
import { usePromptStore } from '../store/promptStore';
import { runGacha, getGachaModeLabel, getGachaModeIcon, type GachaMode } from '../utils/gachaGenerator';
import { getCategoryById } from '../data/categories';
import type { SelectedOptions } from '../types';

const GACHA_MODES: GachaMode[] = ['person', 'background', 'texture'];

// モードに対応するmainCategoryId
const MODE_TO_MAIN_CATEGORY: Record<GachaMode, string> = {
  person: 'person',
  background: 'background',
  texture: 'texture',
};

export function GachaPanel() {
  const [selectedMode, setSelectedMode] = useState<GachaMode>('person');
  const [isSpinning, setIsSpinning] = useState(false);
  const [lockSelected, setLockSelected] = useState(false);
  const { setSelectedOptions, selectedOptions } = usePromptStore();

  // 現在のモードに関連する選択済みオプションを取得
  const getLockedOptionsForMode = (): SelectedOptions => {
    const locked: SelectedOptions = {};
    const targetMainCategory = MODE_TO_MAIN_CATEGORY[selectedMode];

    for (const [categoryId, optionIds] of Object.entries(selectedOptions)) {
      const category = getCategoryById(categoryId);
      if (category?.mainCategoryId === targetMainCategory && optionIds.length > 0) {
        locked[categoryId] = optionIds;
      }
    }
    return locked;
  };

  // 現在のモードで選択済みの項目数を取得
  const getLockedCount = (): number => {
    return Object.keys(getLockedOptionsForMode()).length;
  };

  const handleGacha = () => {
    setIsSpinning(true);

    // アニメーション効果のため少し遅延
    setTimeout(() => {
      // 共通設定（common）を保持
      const preservedOptions: Record<string, string[]> = {};
      for (const [categoryId, optionIds] of Object.entries(selectedOptions)) {
        const category = getCategoryById(categoryId);
        if (category?.mainCategoryId === 'common') {
          preservedOptions[categoryId] = optionIds;
        }
      }

      // 固定オプションを取得（lockSelectedがONの場合のみ）
      const lockedOptions = lockSelected ? getLockedOptionsForMode() : undefined;

      // ガチャを実行
      const gachaResult = runGacha(selectedMode, lockedOptions);

      // 共通設定を維持しつつガチャ結果をマージ
      const mergedOptions = {
        ...preservedOptions,
        ...gachaResult,
      };

      // 結果をストアに反映
      setSelectedOptions(mergedOptions);

      setIsSpinning(false);
    }, 500);
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎰</span>
        <h2 className="text-sm font-medium text-purple-700">ガチャで生成</h2>
      </div>

      {/* モード選択 */}
      <div className="flex gap-2 mb-4">
        {GACHA_MODES.map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedMode(mode)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all
              ${
                selectedMode === mode
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-purple-100 border border-purple-200'
              }
            `}
          >
            <span className="mr-1">{getGachaModeIcon(mode)}</span>
            {getGachaModeLabel(mode)}
          </button>
        ))}
      </div>

      {/* 選択済み固定トグル */}
      <div className="mb-3">
        <button
          onClick={() => setLockSelected(!lockSelected)}
          className={`
            w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all
            ${lockSelected
              ? 'bg-amber-100 border-2 border-amber-400 text-amber-700'
              : 'bg-white border border-purple-200 text-gray-600 hover:bg-purple-50'
            }
          `}
        >
          <span className="flex items-center gap-2">
            <span>{lockSelected ? '🔒' : '🔓'}</span>
            <span>選択済みを固定</span>
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${lockSelected ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>
            {getLockedCount()}件固定中
          </span>
        </button>
        {lockSelected && getLockedCount() > 0 && (
          <p className="text-xs text-amber-600 mt-1 pl-1">
            選択済みの項目はガチャで変更されません
          </p>
        )}
      </div>

      {/* ガチャボタン */}
      <button
        onClick={handleGacha}
        disabled={isSpinning}
        className={`
          w-full py-3 px-4 rounded-xl font-bold text-white
          transition-all transform
          ${
            isSpinning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
          }
        `}
      >
        {isSpinning ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            回転中...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="text-xl">🎲</span>
            ガチャを回す！
          </span>
        )}
      </button>

      <p className="text-xs text-purple-500 mt-2 text-center">
        ランダムでプロンプトを生成します
      </p>
    </div>
  );
}
