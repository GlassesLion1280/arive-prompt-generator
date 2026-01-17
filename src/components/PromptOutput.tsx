import { CopyButton } from './common/CopyButton';
import { Button } from './common/Button';
import { usePromptStore } from '../store/promptStore';
import { useHistoryStore } from '../store/historyStore';
import { useClipboard } from '../hooks/useClipboard';
import { countSelectedOptions } from '../utils/promptBuilder';
import { getCategoryById, getOptionById } from '../data/categories';

interface SelectedItem {
  categoryId: string;
  categoryLabel: string;
  optionId: string;
  optionLabel: string;
}

export function PromptOutput() {
  const {
    generatedPrompt,
    selectedOptions,
    resetAllSelections,
    toggleOption,
    imageCount,
    selectedModel,
    outputLanguage,
    freeText,
    showNegativePrompt,
    thumbnailText,
  } = usePromptStore();
  const { addPromptHistory } = useHistoryStore();
  const { isCopied, copyToClipboard } = useClipboard();

  const selectedCount = countSelectedOptions(selectedOptions);

  // プロンプトに出力枚数を追加
  const getFullPromptWithCount = () => {
    if (!generatedPrompt?.fullPrompt) return '';
    if (imageCount === 1) return generatedPrompt.fullPrompt;
    return `${generatedPrompt.fullPrompt}\n\n${imageCount}枚分のパターン生成してください`;
  };

  const handleCopy = () => {
    const promptWithCount = getFullPromptWithCount();
    if (promptWithCount) {
      copyToClipboard(promptWithCount);
      // 履歴に保存
      addPromptHistory({
        selectedModel,
        selectedOptions,
        outputLanguage,
        freeText,
        showNegativePrompt,
        thumbnailText,
        fullPrompt: promptWithCount,
      });
    }
  };

  // 選択されたアイテムのリストを作成
  const selectedItems: SelectedItem[] = [];
  for (const [categoryId, optionIds] of Object.entries(selectedOptions)) {
    if (!optionIds || optionIds.length === 0) continue;
    const category = getCategoryById(categoryId);
    if (!category) continue;

    for (const optionId of optionIds) {
      const option = getOptionById(categoryId, optionId);
      if (option) {
        selectedItems.push({
          categoryId,
          categoryLabel: category.labelJa,
          optionId,
          optionLabel: option.labelJa,
        });
      }
    }
  }

  const handleRemoveItem = (categoryId: string, optionId: string) => {
    toggleOption(categoryId, optionId);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-500">
          生成プロンプト {selectedCount > 0 && `(${selectedCount}項目選択中)`}
        </h2>
        <div className="flex gap-2">
          <CopyButton
            onClick={handleCopy}
            isCopied={isCopied}
            disabled={!generatedPrompt?.fullPrompt}
          />
          <Button variant="secondary" onClick={resetAllSelections} disabled={selectedCount === 0}>
            リセット
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 min-h-[120px] border border-gray-200">
        {generatedPrompt?.fullPrompt ? (
          <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
            {getFullPromptWithCount()}
          </pre>
        ) : (
          <p className="text-gray-400 text-sm">
            ボタンを選択するとプロンプトが生成されます
          </p>
        )}
      </div>

      {/* 選択されたボタン一覧 */}
      {selectedItems.length > 0 && (
        <div className="mt-4">
          <h3 className="text-xs font-medium text-gray-400 mb-2">選択中のボタン（クリックで削除）</h3>
          <div className="flex flex-wrap gap-1.5 max-h-[150px] overflow-y-auto">
            {selectedItems.map((item) => (
              <button
                key={`${item.categoryId}-${item.optionId}`}
                onClick={() => handleRemoveItem(item.categoryId, item.optionId)}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full
                         bg-primary-100 text-primary-700 hover:bg-primary-200
                         transition-colors cursor-pointer group"
                title={`${item.categoryLabel}: ${item.optionLabel} を削除`}
              >
                <span>{item.optionLabel}</span>
                <span className="text-primary-400 group-hover:text-primary-600">×</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
