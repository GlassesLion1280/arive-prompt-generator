import { useState, useMemo, useCallback } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ModelSelector } from '../components/ModelSelector';
import { LanguageToggle } from '../components/LanguageToggle';
import { Accordion } from '../components/common/Accordion';
import { OptionButtonGrid } from '../components/OptionButtonGrid';
import { usePromptStore } from '../store/promptStore';
import {
  MATERIAL_MAIN_CATEGORIES,
  VTUBER_MATERIAL_CATEGORIES,
  ORIPA_FRAME_CATEGORIES,
} from '../data/categories';
import type { SelectedOptions } from '../types';

type MaterialMode = 'vtuber-material' | 'oripa-material';

export function MaterialPage() {
  const [materialMode, setMaterialMode] = useState<MaterialMode>('vtuber-material');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [materialOptions, setMaterialOptions] = useState<SelectedOptions>({});
  const { outputLanguage } = usePromptStore();

  // モード別のカテゴリを取得
  const categories = useMemo(() => {
    return materialMode === 'vtuber-material'
      ? VTUBER_MATERIAL_CATEGORIES
      : ORIPA_FRAME_CATEGORIES;
  }, [materialMode]);

  // プロンプト生成
  const generatedPrompt = useMemo(() => {
    const parts: string[] = [];

    // カテゴリ順にソート
    const sortedCategories = [...categories].sort((a, b) => a.promptOrder - b.promptOrder);

    for (const category of sortedCategories) {
      const selectedIds = materialOptions[category.id] || [];
      for (const optionId of selectedIds) {
        const option = category.options.find((o) => o.id === optionId);
        if (option) {
          // 言語に応じてプロンプトを選択
          const text = outputLanguage === 'ja' && option.promptJa ? option.promptJa : option.promptEn;
          if (text) {
            parts.push(text);
          }
        }
      }
    }

    return parts.join(', ');
  }, [materialOptions, categories, outputLanguage]);

  // オプション選択のトグル
  const toggleOption = useCallback((categoryId: string, optionId: string) => {
    setMaterialOptions((prev) => {
      const currentOptions = prev[categoryId] || [];
      const isSelected = currentOptions.includes(optionId);

      if (isSelected) {
        return {
          ...prev,
          [categoryId]: currentOptions.filter((id) => id !== optionId),
        };
      } else {
        return {
          ...prev,
          [categoryId]: [...currentOptions, optionId],
        };
      }
    });
  }, []);

  // アコーディオントグル
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  // 全て閉じる
  const collapseAll = useCallback(() => {
    setExpandedCategories([]);
  }, []);

  // リセット
  const resetOptions = useCallback(() => {
    setMaterialOptions({});
  }, []);

  // コピー
  const copyPrompt = useCallback(() => {
    if (generatedPrompt) {
      navigator.clipboard.writeText(generatedPrompt);
    }
  }, [generatedPrompt]);

  // 選択数をカウント
  const selectedCount = useMemo(() => {
    return Object.values(materialOptions).reduce((sum, ids) => sum + ids.length, 0);
  }, [materialOptions]);

  // 開いているカテゴリ数
  const openedCount = useMemo(() => {
    return expandedCategories.filter((id) =>
      categories.some((cat) => cat.id === id)
    ).length;
  }, [expandedCategories, categories]);

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* モデル選択 */}
        <ModelSelector />

        {/* 設定 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center gap-4">
            <LanguageToggle />
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左カラム：カテゴリ選択 */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* 素材タイプ切り替え */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500">素材タイプ選択</h2>
              </div>
              <div className="flex gap-2">
                {MATERIAL_MAIN_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMaterialMode(cat.id as MaterialMode)}
                    className={`
                      flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all
                      ${materialMode === cat.id
                        ? 'bg-emerald-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                      }
                    `}
                  >
                    {cat.id === 'vtuber-material' ? '🎬 ' : '🃏 '}
                    {cat.labelJa}
                  </button>
                ))}
              </div>
            </div>

            {/* カテゴリパネル */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500">
                  {materialMode === 'vtuber-material' ? 'VTuber素材' : 'オリパ/トレカ'}
                  のカテゴリ
                  <span className="ml-2 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {categories.length}カテゴリ
                  </span>
                </h2>
                {openedCount > 0 && (
                  <button
                    onClick={collapseAll}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    すべて閉じる
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {categories.map((category) => {
                  const selectedIds = materialOptions[category.id] || [];
                  const isOpen = expandedCategories.includes(category.id);
                  const title = selectedIds.length > 0
                    ? `${category.labelJa} (${selectedIds.length})`
                    : category.labelJa;

                  return (
                    <Accordion
                      key={category.id}
                      title={title}
                      isOpen={isOpen}
                      onToggle={() => toggleCategory(category.id)}
                    >
                      <OptionButtonGrid
                        options={category.options}
                        selectedIds={selectedIds}
                        onToggle={(optionId) => toggleOption(category.id, optionId)}
                      />
                    </Accordion>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右カラム：プロンプト出力 */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* プロンプト出力 */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-gray-500">
                    生成プロンプト ({selectedCount}項目選択中)
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={copyPrompt}
                      disabled={!generatedPrompt}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white text-xs rounded-lg hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      コピー
                    </button>
                    <button
                      onClick={resetOptions}
                      className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      リセット
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 min-h-[150px] max-h-[300px] overflow-y-auto">
                  {generatedPrompt ? (
                    <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
                      {generatedPrompt}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      カテゴリからオプションを選択するとプロンプトが生成されます
                    </p>
                  )}
                </div>

                {/* 選択中のボタン */}
                {selectedCount > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">選択中のボタン（クリックで削除）</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(materialOptions).map(([categoryId, optionIds]) =>
                        optionIds.map((optionId) => {
                          const category = categories.find((c) => c.id === categoryId);
                          const option = category?.options.find((o) => o.id === optionId);
                          if (!option) return null;
                          return (
                            <button
                              key={optionId}
                              onClick={() => toggleOption(categoryId, optionId)}
                              className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                            >
                              {option.labelJa} ×
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ヒント */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h3 className="text-sm font-medium text-emerald-700 mb-2">
                  💡 使い方ヒント
                </h3>
                <ul className="text-xs text-emerald-600 space-y-1">
                  <li>• 白/黒背景で生成 → Photoshopで切り抜き</li>
                  <li>• 複数の素材タイプを組み合わせ可能</li>
                  <li>• テーマとカラーを合わせると統一感UP</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
