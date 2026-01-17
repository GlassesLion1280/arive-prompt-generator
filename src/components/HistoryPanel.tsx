import { useState } from 'react';
import { useHistoryStore } from '../store/historyStore';
import { usePromptStore } from '../store/promptStore';
import { useClipboard } from '../hooks/useClipboard';

export function HistoryPanel() {
  const { promptHistory, removePromptHistory, clearPromptHistory } = useHistoryStore();
  const { loadFromFavorite } = usePromptStore();
  const { copyToClipboard } = useClipboard();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleLoad = (item: typeof promptHistory[0]) => {
    loadFromFavorite({
      selectedModel: item.selectedModel,
      selectedOptions: item.selectedOptions,
      outputLanguage: item.outputLanguage,
      freeText: item.freeText,
      showNegativePrompt: item.showNegativePrompt,
      thumbnailText: item.thumbnailText,
    });
  };

  const handleCopy = (prompt: string) => {
    copyToClipboard(prompt);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  // プロンプトの先頭を切り取って表示
  const truncatePrompt = (prompt: string, maxLength: number = 50) => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-blue-500">🕐</span>
          <span className="text-sm font-medium text-gray-700">
            履歴 ({promptHistory.length}/30)
          </span>
        </div>
        <span className="text-gray-400 text-sm">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* クリアボタン */}
          {promptHistory.length > 0 && (
            <div className="mt-3 flex justify-end">
              <button
                onClick={clearPromptHistory}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                すべて削除
              </button>
            </div>
          )}

          {/* 履歴リスト */}
          {promptHistory.length > 0 ? (
            <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto">
              {promptHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2 bg-gray-50 rounded-lg group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">
                        {formatDate(item.createdAt)}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {truncatePrompt(item.fullPrompt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(item.fullPrompt)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                        title="コピー"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => handleLoad(item)}
                        className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                        title="読み込む"
                      >
                        ↩️
                      </button>
                      <button
                        onClick={() => removePromptHistory(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="削除"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-gray-400 text-center">
              履歴はありません
            </p>
          )}
        </div>
      )}
    </div>
  );
}
