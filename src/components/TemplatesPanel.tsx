import { useState, useMemo } from 'react';
import { PRESET_TEMPLATES, TEMPLATE_CATEGORIES, THUMBNAIL_SUB_CATEGORIES, type PresetTemplate, type ThumbnailSubCategory } from '../data/presetTemplates';
import { usePromptStore } from '../store/promptStore';

export function TemplatesPanel() {
  const { loadFromFavorite, mergeOptions, selectedModel } = usePromptStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PresetTemplate['category']>('settings');
  const [selectedThumbnailSubCategory, setSelectedThumbnailSubCategory] = useState<ThumbnailSubCategory>('thumb-yukkuri');

  // Nanobanana Pro（サムネイル）が選択されているか
  const isNanobananaThumb = selectedModel === 'nanobanana-thumb';

  const handleLoadTemplate = (template: PresetTemplate) => {
    // 現在選択中のモデルを維持してオプションのみ適用
    // 「共通設定」カテゴリはマージ、それ以外は置き換え
    if (template.category === 'settings') {
      mergeOptions(template.selectedOptions);
    } else {
      loadFromFavorite({
        selectedModel: selectedModel, // 現在のモデルを維持
        selectedOptions: template.selectedOptions,
        outputLanguage: template.outputLanguage,
        freeText: template.freeText,
        showNegativePrompt: template.showNegativePrompt,
      });
    }
  };

  // サムネイルテンプレートの数を計算
  const thumbnailTemplateCount = useMemo(() => {
    return PRESET_TEMPLATES.filter((t) => t.selectedModel === 'nanobanana-thumb').length;
  }, []);

  // 通常テンプレートの数を計算
  const regularTemplateCount = useMemo(() => {
    return PRESET_TEMPLATES.filter((t) => t.selectedModel !== 'nanobanana-thumb').length;
  }, []);

  // フィルタされたテンプレート
  const filteredTemplates = useMemo(() => {
    if (isNanobananaThumb) {
      // サムネイルモード: サブカテゴリでフィルタ
      return PRESET_TEMPLATES.filter((t) =>
        t.selectedModel === 'nanobanana-thumb' &&
        t.thumbnailSubCategory === selectedThumbnailSubCategory
      );
    } else {
      // 通常モード: カテゴリでフィルタ + モデル指定があるテンプレートは除外
      return PRESET_TEMPLATES.filter((t) => {
        if (t.category !== selectedCategory) return false;
        // selectedModelが設定されているテンプレートは、現在のモデルと一致時のみ表示
        if (t.selectedModel && t.selectedModel !== selectedModel) return false;
        return true;
      });
    }
  }, [isNanobananaThumb, selectedThumbnailSubCategory, selectedCategory, selectedModel]);

  // 各サブカテゴリのテンプレート数を計算
  const subCategoryCounts = useMemo(() => {
    const counts: Record<ThumbnailSubCategory, number> = {} as Record<ThumbnailSubCategory, number>;
    for (const subCat of THUMBNAIL_SUB_CATEGORIES) {
      counts[subCat.id] = PRESET_TEMPLATES.filter(
        (t) => t.selectedModel === 'nanobanana-thumb' && t.thumbnailSubCategory === subCat.id
      ).length;
    }
    return counts;
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-500">📋</span>
          <span className="text-sm font-medium text-gray-700">
            テンプレート ({isNanobananaThumb ? thumbnailTemplateCount : regularTemplateCount})
          </span>
          {isNanobananaThumb && (
            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
              サムネイル専用
            </span>
          )}
        </div>
        <span className="text-gray-400 text-sm">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {isNanobananaThumb ? (
            // サムネイル専用サブカテゴリタブ
            <>
              <div className="mt-3 flex flex-wrap gap-1">
                {THUMBNAIL_SUB_CATEGORIES.map((subCat) => (
                  <button
                    key={subCat.id}
                    onClick={() => setSelectedThumbnailSubCategory(subCat.id)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors flex items-center gap-1
                      ${selectedThumbnailSubCategory === subCat.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    <span>{subCat.icon}</span>
                    <span>{subCat.label}</span>
                    <span className={`text-[10px] ${selectedThumbnailSubCategory === subCat.id ? 'text-orange-200' : 'text-gray-400'}`}>
                      ({subCategoryCounts[subCat.id]})
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            // 通常カテゴリタブ
            <div className="mt-3 flex flex-wrap gap-1">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors
                    ${selectedCategory === cat.id
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* テンプレートリスト */}
          <div className="mt-3 space-y-2 max-h-[400px] overflow-y-auto">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template)}
                  className={`w-full text-left p-2 rounded-lg border border-transparent transition-colors group
                    ${isNanobananaThumb
                      ? 'bg-orange-50 hover:bg-orange-100 hover:border-orange-200'
                      : 'bg-gray-50 hover:bg-primary-50 hover:border-primary-200'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${isNanobananaThumb ? 'text-orange-700 group-hover:text-orange-800' : 'text-gray-700 group-hover:text-primary-700'}`}>
                      {template.name}
                    </span>
                    <span className={`text-xs ${isNanobananaThumb ? 'text-orange-400 group-hover:text-orange-500' : 'text-gray-400 group-hover:text-primary-500'}`}>
                      適用 →
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {template.description}
                  </p>
                </button>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                このカテゴリにはテンプレートがありません
              </p>
            )}
          </div>

          <p className="mt-3 text-xs text-gray-400 text-center">
            クリックでテンプレートを適用
          </p>
        </div>
      )}
    </div>
  );
}
