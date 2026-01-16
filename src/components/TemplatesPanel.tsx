import { useState } from 'react';
import { PRESET_TEMPLATES, TEMPLATE_CATEGORIES, type PresetTemplate } from '../data/presetTemplates';
import { usePromptStore } from '../store/promptStore';

export function TemplatesPanel() {
  const { loadFromFavorite, mergeOptions, selectedModel } = usePromptStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PresetTemplate['category']>('settings');

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

  // カテゴリでフィルタ + モデル指定があるテンプレートは現在のモデルと一致時のみ表示
  const filteredTemplates = PRESET_TEMPLATES.filter((t) => {
    if (t.category !== selectedCategory) return false;
    // selectedModelが設定されているテンプレートは、現在のモデルと一致時のみ表示
    if (t.selectedModel && t.selectedModel !== selectedModel) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-500">📋</span>
          <span className="text-sm font-medium text-gray-700">
            テンプレート ({PRESET_TEMPLATES.length})
          </span>
        </div>
        <span className="text-gray-400 text-sm">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* カテゴリタブ */}
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

          {/* テンプレートリスト */}
          <div className="mt-3 space-y-2">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleLoadTemplate(template)}
                className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-primary-50
                         hover:border-primary-200 border border-transparent
                         transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary-700">
                    {template.name}
                  </span>
                  <span className="text-xs text-gray-400 group-hover:text-primary-500">
                    適用 →
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {template.description}
                </p>
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-gray-400 text-center">
            クリックでテンプレートを適用
          </p>
        </div>
      )}
    </div>
  );
}
