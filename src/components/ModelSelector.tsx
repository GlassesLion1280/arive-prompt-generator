import { useState, useRef, useEffect } from 'react';
import { AI_MODELS, MODEL_GROUPS } from '../data/models';
import { usePromptStore } from '../store/promptStore';
import type { AIModelId } from '../types';

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = usePromptStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (modelId: AIModelId) => {
    setSelectedModel(modelId);
    setIsOpen(false);
  };

  // 選択中モデルのグループを取得
  const currentGroup = MODEL_GROUPS.find((g) => g.modelIds.includes(selectedModel));

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <h2 className="text-sm font-medium text-gray-500 mb-3">AIモデル選択</h2>

      <div className="relative" ref={dropdownRef}>
        {/* 選択ボタン */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
                     flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            {/* グループアイコン */}
            <span className={`
              w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold
              ${currentGroup?.id === 'nanobanana' ? 'bg-orange-500' :
                currentGroup?.id === 'general' ? 'bg-blue-500' : 'bg-gray-500'}
            `}>
              {currentGroup?.id === 'nanobanana' ? '🍌' :
               currentGroup?.id === 'general' ? '🎨' : '✨'}
            </span>
            <div className="text-left">
              <p className="font-medium text-gray-800">{currentModel?.displayName}</p>
              <p className="text-xs text-gray-500">{currentGroup?.label}</p>
            </div>
          </div>
          <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {/* ドロップダウン */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {MODEL_GROUPS.map((group) => (
              <div key={group.id}>
                {/* グループヘッダー */}
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">{group.label}</p>
                  <p className="text-xs text-gray-400">{group.description}</p>
                </div>
                {/* グループ内のモデル */}
                {group.modelIds.map((modelId) => {
                  const model = AI_MODELS.find((m) => m.id === modelId);
                  if (!model) return null;
                  const isSelected = selectedModel === modelId;

                  return (
                    <button
                      key={modelId}
                      onClick={() => handleSelect(modelId)}
                      className={`
                        w-full px-4 py-2.5 text-left flex items-center justify-between
                        transition-colors
                        ${isSelected
                          ? 'bg-primary-50 text-primary-700'
                          : 'hover:bg-gray-50 text-gray-700'
                        }
                      `}
                    >
                      <span className="text-sm">{model.displayName}</span>
                      {isSelected && (
                        <span className="text-primary-500">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* モデル特徴タグ */}
      {currentModel && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {currentModel.supportedFeatures.japaneseOutput && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              日本語対応
            </span>
          )}
          {currentModel.supportedFeatures.negativePrompt && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
              ネガティブ対応
            </span>
          )}
          {selectedModel === 'nanobanana-thumb' && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
              サムネイル専用
            </span>
          )}
        </div>
      )}
    </div>
  );
}
