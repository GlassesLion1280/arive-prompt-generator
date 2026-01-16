import { useState } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { usePromptStore } from '../store/promptStore';
import { Button } from './common/Button';

export function FavoritesPanel() {
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const {
    selectedModel,
    selectedOptions,
    outputLanguage,
    freeText,
    showNegativePrompt,
    loadFromFavorite,
  } = usePromptStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [newName, setNewName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = () => {
    if (!newName.trim()) return;

    addFavorite({
      name: newName.trim(),
      selectedModel,
      selectedOptions,
      outputLanguage,
      freeText,
      showNegativePrompt,
    });

    setNewName('');
    setIsAdding(false);
  };

  const handleLoad = (favorite: typeof favorites[0]) => {
    loadFromFavorite({
      selectedModel: favorite.selectedModel,
      selectedOptions: favorite.selectedOptions,
      outputLanguage: favorite.outputLanguage,
      freeText: favorite.freeText,
      showNegativePrompt: favorite.showNegativePrompt,
    });
  };

  const hasSelection = Object.keys(selectedOptions).length > 0 || freeText.trim();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">★</span>
          <span className="text-sm font-medium text-gray-700">
            お気に入り ({favorites.length})
          </span>
        </div>
        <span className="text-gray-400 text-sm">
          {isExpanded ? '▲' : '▼'}
        </span>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          {/* 保存ボタン */}
          <div className="mt-3">
            {isAdding ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="プリセット名を入力"
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave();
                    if (e.key === 'Escape') setIsAdding(false);
                  }}
                />
                <Button variant="primary" onClick={handleSave} disabled={!newName.trim()}>
                  保存
                </Button>
                <Button variant="secondary" onClick={() => setIsAdding(false)}>
                  キャンセル
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsAdding(true)}
                disabled={!hasSelection}
                className="w-full"
              >
                ＋ 現在の選択を保存
              </Button>
            )}
          </div>

          {/* お気に入りリスト */}
          {favorites.length > 0 ? (
            <div className="mt-3 space-y-2">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
                >
                  <button
                    onClick={() => handleLoad(fav)}
                    className="flex-1 text-left text-sm text-gray-700 hover:text-primary-600
                             truncate"
                    title={`読み込む: ${fav.name}`}
                  >
                    {fav.name}
                  </button>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100
                             transition-opacity p-1"
                    title="削除"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-gray-400 text-center">
              保存されたお気に入りはありません
            </p>
          )}
        </div>
      )}
    </div>
  );
}
