import { useEffect, useMemo } from 'react';
import { Tab } from './common/Tab';
import { SubCategoryAccordion } from './SubCategoryAccordion';
import { usePromptStore } from '../store/promptStore';
import { getMainCategoriesForModel, getCategoriesByMain } from '../data/categories';
import type { MainCategoryId } from '../types';

export function CategoryPanel() {
  const { activeMainCategory, setActiveMainCategory, selectedModel, selectedOptions, expandedSubCategories, collapseAllSubCategories } = usePromptStore();

  // モデル別のメインカテゴリを取得
  const mainCategories = getMainCategoriesForModel(selectedModel);

  // 各メインカテゴリの選択数を計算
  const categorySelectionCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    for (const mainCat of mainCategories) {
      let count = 0;
      // そのメインカテゴリに属するサブカテゴリを取得
      const subCategories = getCategoriesByMain(mainCat.id, selectedModel);

      for (const subCat of subCategories) {
        const selected = selectedOptions[subCat.id];
        if (selected) {
          count += selected.length;
        }
      }
      counts[mainCat.id] = count;
    }

    return counts;
  }, [mainCategories, selectedModel, selectedOptions]);

  const mainCategoryItems = mainCategories.map((cat) => ({
    id: cat.id,
    label: cat.labelJa,
    badge: categorySelectionCounts[cat.id] || undefined,
  }));

  // モデル切り替え時のカテゴリ自動選択
  useEffect(() => {
    if (selectedModel === 'nanobanana-thumb' && activeMainCategory !== 'thumbnail') {
      // Nanobanana Pro (サムネイル) に切り替えたらサムネイルタブを選択
      setActiveMainCategory('thumbnail');
    } else if (selectedModel !== 'nanobanana-thumb' && activeMainCategory === 'thumbnail') {
      // サムネイルモデル以外で、thumbnailが選択されていたらpersonに戻す
      setActiveMainCategory('person');
    }
  }, [selectedModel, activeMainCategory, setActiveMainCategory]);

  const subCategories = getCategoriesByMain(activeMainCategory, selectedModel);

  // 現在のメインカテゴリで開いているサブカテゴリの数
  const openedCount = subCategories.filter((cat) => expandedSubCategories.includes(cat.id)).length;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-500">
          カテゴリ選択
          {selectedModel === 'nanobanana-thumb' && (
            <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              Nanobanana Pro専用
            </span>
          )}
        </h2>
        {openedCount > 0 && (
          <button
            onClick={collapseAllSubCategories}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            すべて閉じる
          </button>
        )}
      </div>

      <Tab
        items={mainCategoryItems}
        activeId={activeMainCategory}
        onSelect={(id) => setActiveMainCategory(id as MainCategoryId)}
      />

      <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
        {subCategories.map((category) => (
          <SubCategoryAccordion key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
