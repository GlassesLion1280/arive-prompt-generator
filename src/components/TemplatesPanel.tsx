import { useState } from 'react';
import { PRESET_TEMPLATES, TEMPLATE_CATEGORIES, type PresetTemplate } from '../data/presetTemplates';
import { usePromptStore } from '../store/promptStore';

export function TemplatesPanel() {
  const { loadFromFavorite, mergeOptions, selectedModel } = usePromptStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PresetTemplate['category']>('settings');

  const handleLoadTemplate = (template: PresetTemplate) => {
    // 「共通設定」カテゴリのテンプレートは現在のモデルを保持してオプションのみマージ
    // また、サムネイルモデル選択中は常にモデルを保持してオプションのみマージ
    if (template.category === 'settings' || selectedModel === 'nanobanana-thumb') {
      mergeOptions(template.selectedOptions);
    } else {
      loadFromFavorite({
        selectedModel: template.selectedModel,
        selectedOptions: template.selectedOptions,
        outputLanguage: template.outputLanguage,
        freeText: template.freeText,
        showNegativePrompt: template.showNegativePrompt,
      });
    }
  };

  const filteredTemplates = PRESET_TEMPLATES.filter((t) => t.category === selectedCategory);

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
