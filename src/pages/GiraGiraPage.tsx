import { useState, useMemo } from 'react';
import { useEyeCandyStore, useFilteredEffects } from '../store/eyecandyStore';
import { useHistoryStore } from '../store/historyStore';
import { useGiraGiraFavoritesStore } from '../store/giraGiraFavoritesStore';
import { EFFECT_CATEGORIES, type EffectCategory, getEffectCategory, getEffectById } from '../data/eyecandyEffects';
import {
  FINISHING_EFFECTS,
  FINISHING_CATEGORIES,
  type FinishingCategory,
  type FinishingEffect,
  getFinishingCategory,
  getFinishingEffectsByCategory,
} from '../data/finishingEffects';

// タブの種類
type TabType = 'effect' | 'finishing';

// カテゴリバッジの色
const categoryColors: Record<EffectCategory, string> = {
  all: 'bg-gray-100 text-gray-700',
  gold: 'bg-yellow-100 text-yellow-700',
  metal: 'bg-slate-100 text-slate-700',
  neon: 'bg-pink-100 text-pink-700',
  crystal: 'bg-cyan-100 text-cyan-700',
  fire: 'bg-orange-100 text-orange-700',
  nature: 'bg-green-100 text-green-700',
  fantasy: 'bg-purple-100 text-purple-700',
  retro: 'bg-amber-100 text-amber-700',
};

// 最終仕上げカテゴリバッジの色
const finishingCategoryColors: Record<FinishingCategory, string> = {
  all: 'bg-gray-100 text-gray-700',
  element: 'bg-orange-100 text-orange-700',
  glow: 'bg-yellow-100 text-yellow-700',
  impact: 'bg-red-100 text-red-700',
  atmosphere: 'bg-blue-100 text-blue-700',
  frame: 'bg-purple-100 text-purple-700',
  filter: 'bg-green-100 text-green-700',
};

export function GiraGiraPage() {
  const {
    selectedEffect,
    selectedCategory,
    applyScope,
    partialText,
    generatedPrompt,
    setSelectedEffect,
    setSelectedCategory,
    setApplyScope,
    setPartialText,
    resetAll,
  } = useEyeCandyStore();

  const filteredEffects = useFilteredEffects();
  const { giraGiraHistory, addGiraGiraHistory, removeGiraGiraHistory, clearGiraGiraHistory } = useHistoryStore();
  const { favorites, addFavorite, removeFavorite } = useGiraGiraFavoritesStore();

  // タブ切り替え
  const [activeTab, setActiveTab] = useState<TabType>('effect');

  // 最終仕上げ用の状態
  const [selectedFinishingEffect, setSelectedFinishingEffect] = useState<FinishingEffect | null>(null);
  const [selectedFinishingCategory, setSelectedFinishingCategory] = useState<FinishingCategory>('all');
  const [finishingApplyScope, setFinishingApplyScope] = useState<'all' | 'partial'>('all');
  const [finishingPartialText, setFinishingPartialText] = useState('');

  const [copySuccess, setCopySuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [newFavoriteName, setNewFavoriteName] = useState('');
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);

  // 検索でさらにフィルタリング
  const displayedEffects = searchQuery.trim()
    ? filteredEffects.filter((effect) =>
        effect.titleJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredEffects;

  // 最終仕上げエフェクトのフィルタリング
  const filteredFinishingEffects = useMemo(() => {
    let effects = getFinishingEffectsByCategory(selectedFinishingCategory);
    if (searchQuery.trim()) {
      effects = effects.filter((effect) =>
        effect.titleJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return effects;
  }, [selectedFinishingCategory, searchQuery]);

  // 最終仕上げ用プロンプト生成
  const finishingGeneratedPrompt = useMemo(() => {
    if (!selectedFinishingEffect) return '';

    const parts: string[] = [];

    if (finishingApplyScope === 'all') {
      parts.push('Add the following finishing effect to the entire image:');
    } else {
      const target = finishingPartialText.trim() || 'the specified area';
      parts.push(`Add the following finishing effect to "${target}":`);
    }

    parts.push(selectedFinishingEffect.prompt);
    parts.push('Maintain high quality and professional appearance.');

    return parts.join('\n');
  }, [selectedFinishingEffect, finishingApplyScope, finishingPartialText]);

  // 現在のプロンプト（タブによって切り替え）
  const currentPrompt = activeTab === 'effect' ? generatedPrompt : finishingGeneratedPrompt;

  const handleCopy = async () => {
    if (!currentPrompt) return;

    try {
      await navigator.clipboard.writeText(currentPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);

      // エフェクトタブの場合は履歴に保存
      if (activeTab === 'effect' && selectedEffect && generatedPrompt) {
        addGiraGiraHistory({
          effectId: selectedEffect.id,
          effectTitleJa: selectedEffect.titleJa,
          applyScope,
          partialText,
          fullPrompt: generatedPrompt,
        });
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // 履歴から読み込み
  const loadFromHistory = (item: typeof giraGiraHistory[0]) => {
    const effect = getEffectById(item.effectId);
    if (effect) {
      setActiveTab('effect');
      setSelectedEffect(effect);
      setApplyScope(item.applyScope);
      setPartialText(item.partialText);
    }
  };

  // お気に入りから読み込み
  const loadFromFavorite = (fav: typeof favorites[0]) => {
    const effect = getEffectById(fav.effectId);
    if (effect) {
      setActiveTab('effect');
      setSelectedEffect(effect);
      setApplyScope(fav.applyScope);
      setPartialText(fav.partialText);
    }
  };

  // お気に入りに保存
  const handleSaveFavorite = () => {
    if (!newFavoriteName.trim() || !selectedEffect) return;

    addFavorite({
      name: newFavoriteName.trim(),
      effectId: selectedEffect.id,
      effectTitleJa: selectedEffect.titleJa,
      applyScope,
      partialText,
    });

    setNewFavoriteName('');
    setIsAddingFavorite(false);
  };

  // 最終仕上げリセット
  const resetFinishing = () => {
    setSelectedFinishingEffect(null);
    setFinishingApplyScope('all');
    setFinishingPartialText('');
  };

  // 日時フォーマット
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* ヘッダー */}
      <header className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                ギラギラくん
              </h1>
              <p className="text-yellow-100 text-sm mt-1">
                テキストをギラギラに加工するプロンプト生成ツール
              </p>
            </div>
            <span className="text-6xl">✨</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* タブ切り替え */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200 inline-flex">
            <button
              onClick={() => setActiveTab('effect')}
              className={`
                px-6 py-3 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'effect'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              ✨ エフェクト
            </button>
            <button
              onClick={() => setActiveTab('finishing')}
              className={`
                px-6 py-3 rounded-lg text-sm font-medium transition-all
                ${activeTab === 'finishing'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              🎬 最終仕上げ
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {activeTab === 'effect'
              ? '文字やテキストにギラギラエフェクトを適用します'
              : '完成した画像に炎・雷・光などの演出エフェクトを追加します'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: エフェクト選択 */}
          <div className="lg:col-span-2 space-y-4">
            {/* カテゴリフィルター */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-3">
                カテゴリで絞り込み
              </h2>
              <div className="flex flex-wrap gap-2">
                {activeTab === 'effect' ? (
                  // エフェクトタブのカテゴリ
                  EFFECT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${selectedCategory === cat.id
                          ? 'bg-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                        }
                      `}
                    >
                      {cat.labelJa}
                    </button>
                  ))
                ) : (
                  // 最終仕上げタブのカテゴリ
                  FINISHING_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedFinishingCategory(cat.id)}
                      className={`
                        px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${selectedFinishingCategory === cat.id
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-100'
                        }
                      `}
                    >
                      {cat.labelJa}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* エフェクト一覧 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500">
                  {activeTab === 'effect' ? 'エフェクト選択' : '最終仕上げ選択'}
                  <span className="ml-2 text-xs text-gray-400">
                    ({activeTab === 'effect' ? displayedEffects.length : filteredFinishingEffects.length}件
                    {searchQuery && ` / ${activeTab === 'effect' ? filteredEffects.length : FINISHING_EFFECTS.length}件中`})
                  </span>
                </h2>
                {activeTab === 'effect' && selectedEffect && (
                  <button
                    onClick={resetAll}
                    className="text-xs text-orange-500 hover:text-orange-700"
                  >
                    選択解除
                  </button>
                )}
                {activeTab === 'finishing' && selectedFinishingEffect && (
                  <button
                    onClick={resetFinishing}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    選択解除
                  </button>
                )}
              </div>

              {/* 検索ボックス */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={activeTab === 'effect' ? 'エフェクト名で検索...' : '仕上げエフェクト名で検索...'}
                    className={`w-full px-3 py-2 pl-9 border border-gray-200 rounded-lg text-sm
                               focus:ring-2 placeholder:text-gray-400
                               ${activeTab === 'effect'
                                 ? 'focus:ring-orange-400 focus:border-orange-400'
                                 : 'focus:ring-red-400 focus:border-red-400'
                               }`}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
                {activeTab === 'effect' ? (
                  // エフェクトタブの一覧
                  displayedEffects.map((effect) => {
                    const cat = getEffectCategory(effect);
                    const isSelected = selectedEffect?.id === effect.id;

                    return (
                      <button
                        key={effect.id}
                        onClick={() => setSelectedEffect(effect)}
                        className={`
                          p-3 rounded-lg text-left transition-all border
                          ${isSelected
                            ? 'bg-orange-50 border-orange-400 shadow-md'
                            : 'bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-orange-700' : 'text-gray-700'}`}>
                              {effect.titleJa}
                            </p>
                            {effect.titleEn !== effect.titleJa && (
                              <p className="text-xs text-gray-400 truncate mt-0.5">
                                {effect.titleEn}
                              </p>
                            )}
                          </div>
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${categoryColors[cat]}`}>
                            {EFFECT_CATEGORIES.find(c => c.id === cat)?.labelJa}
                          </span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  // 最終仕上げタブの一覧
                  filteredFinishingEffects.map((effect) => {
                    const cat = getFinishingCategory(effect);
                    const isSelected = selectedFinishingEffect?.id === effect.id;

                    return (
                      <button
                        key={effect.id}
                        onClick={() => setSelectedFinishingEffect(effect)}
                        className={`
                          p-3 rounded-lg text-left transition-all border
                          ${isSelected
                            ? 'bg-red-50 border-red-400 shadow-md'
                            : 'bg-gray-50 border-gray-200 hover:bg-red-50 hover:border-red-200'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>
                              {effect.titleJa}
                            </p>
                            {effect.titleEn !== effect.titleJa && (
                              <p className="text-xs text-gray-400 truncate mt-0.5">
                                {effect.titleEn}
                              </p>
                            )}
                          </div>
                          <span className={`ml-2 px-2 py-0.5 rounded text-xs ${finishingCategoryColors[cat]}`}>
                            {FINISHING_CATEGORIES.find(c => c.id === cat)?.labelJa}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* 右カラム: 設定と出力 */}
          <div className="space-y-4">
            {/* 適用範囲設定 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-3">
                適用範囲
              </h2>

              <div className="space-y-3">
                {/* 全体/一部の切り替え */}
                <div className="flex gap-2">
                  <button
                    onClick={() => activeTab === 'effect' ? setApplyScope('all') : setFinishingApplyScope('all')}
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${(activeTab === 'effect' ? applyScope : finishingApplyScope) === 'all'
                        ? activeTab === 'effect'
                          ? 'bg-orange-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                      }
                    `}
                  >
                    全体に適用
                  </button>
                  <button
                    onClick={() => activeTab === 'effect' ? setApplyScope('partial') : setFinishingApplyScope('partial')}
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${(activeTab === 'effect' ? applyScope : finishingApplyScope) === 'partial'
                        ? activeTab === 'effect'
                          ? 'bg-orange-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                      }
                    `}
                  >
                    一部に適用
                  </button>
                </div>

                {/* 一部適用の場合のテキスト入力 */}
                {activeTab === 'effect' && applyScope === 'partial' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      加工したい文字を入力
                    </label>
                    <input
                      type="text"
                      value={partialText}
                      onChange={(e) => setPartialText(e.target.value)}
                      placeholder="例: 激安, 限定, NEW..."
                      className="w-full px-3 py-2 border border-orange-200 rounded-lg text-sm
                                 focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                                 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-orange-600 mt-1">
                      「{partialText || '○○'}」の文字だけギラギラになります
                    </p>
                  </div>
                )}
                {activeTab === 'finishing' && finishingApplyScope === 'partial' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      エフェクトを適用する対象
                    </label>
                    <input
                      type="text"
                      value={finishingPartialText}
                      onChange={(e) => setFinishingPartialText(e.target.value)}
                      placeholder="例: 文字, 人物, タイトル..."
                      className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm
                                 focus:ring-2 focus:ring-red-400 focus:border-red-400
                                 placeholder:text-gray-400"
                    />
                    <p className="text-xs text-red-600 mt-1">
                      「{finishingPartialText || '○○'}」の周りにエフェクトが付きます
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* プロンプト出力 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500">
                  生成されたプロンプト
                </h2>
                {currentPrompt && (
                  <button
                    onClick={handleCopy}
                    className={`
                      px-3 py-1 rounded-lg text-sm font-medium transition-all
                      ${copySuccess
                        ? 'bg-green-500 text-white'
                        : activeTab === 'effect'
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }
                    `}
                  >
                    {copySuccess ? 'コピー完了!' : 'コピー'}
                  </button>
                )}
              </div>

              {currentPrompt ? (
                <div className="bg-gray-50 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {currentPrompt}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    {activeTab === 'effect' ? 'エフェクト' : '仕上げエフェクト'}を選択すると<br />プロンプトが表示されます
                  </p>
                </div>
              )}
            </div>

            {/* 履歴パネル（エフェクトタブのみ） */}
            {activeTab === 'effect' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">🕐</span>
                    <span className="text-sm font-medium text-gray-700">
                      履歴 ({giraGiraHistory.length}/30)
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {isHistoryExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {isHistoryExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {giraGiraHistory.length > 0 && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={clearGiraGiraHistory}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          すべて削除
                        </button>
                      </div>
                    )}

                    {giraGiraHistory.length > 0 ? (
                      <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                        {giraGiraHistory.map((item) => (
                          <div
                            key={item.id}
                            className="p-2 bg-gray-50 rounded-lg group"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-400 mb-1">
                                  {formatDate(item.createdAt)}
                                </p>
                                <p className="text-xs text-gray-700 font-medium truncate">
                                  {item.effectTitleJa}
                                  {item.applyScope === 'partial' && item.partialText && (
                                    <span className="text-gray-400 ml-1">
                                      ({item.partialText})
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => loadFromHistory(item)}
                                  className="p-1 text-gray-400 hover:text-green-500 transition-colors"
                                  title="読み込む"
                                >
                                  ↩️
                                </button>
                                <button
                                  onClick={() => removeGiraGiraHistory(item.id)}
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
            )}

            {/* お気に入りパネル（エフェクトタブのみ） */}
            {activeTab === 'effect' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-gray-700">
                      お気に入り ({favorites.length})
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {isFavoritesExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {isFavoritesExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {/* 保存ボタン */}
                    <div className="mt-3">
                      {isAddingFavorite ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFavoriteName}
                            onChange={(e) => setNewFavoriteName(e.target.value)}
                            placeholder="プリセット名を入力"
                            className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg
                                     focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveFavorite();
                              if (e.key === 'Escape') setIsAddingFavorite(false);
                            }}
                          />
                          <button
                            onClick={handleSaveFavorite}
                            disabled={!newFavoriteName.trim()}
                            className="px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg
                                     hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setIsAddingFavorite(false)}
                            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsAddingFavorite(true)}
                          disabled={!selectedEffect}
                          className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg
                                   hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          ＋ 現在の選択を保存
                        </button>
                      )}
                    </div>

                    {/* お気に入りリスト */}
                    {favorites.length > 0 ? (
                      <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
                        {favorites.map((fav) => (
                          <div
                            key={fav.id}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
                          >
                            <button
                              onClick={() => loadFromFavorite(fav)}
                              className="flex-1 text-left text-sm text-gray-700 hover:text-orange-600 truncate"
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
            )}

            {/* 使い方 */}
            <div className={`rounded-xl p-4 border ${activeTab === 'effect' ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
              <h3 className={`text-sm font-medium mb-2 ${activeTab === 'effect' ? 'text-orange-700' : 'text-red-700'}`}>
                使い方
              </h3>
              <ol className={`text-xs space-y-1 list-decimal list-inside ${activeTab === 'effect' ? 'text-orange-600' : 'text-red-600'}`}>
                {activeTab === 'effect' ? (
                  <>
                    <li>エフェクトを選択</li>
                    <li>全体/一部の適用範囲を選択</li>
                    <li>プロンプトをコピー</li>
                    <li>画像生成AIに画像と一緒に貼り付け</li>
                  </>
                ) : (
                  <>
                    <li>仕上げエフェクトを選択</li>
                    <li>全体/一部の適用範囲を選択</li>
                    <li>プロンプトをコピー</li>
                    <li>完成した画像と一緒にAIに貼り付け</li>
                  </>
                )}
              </ol>
              <p className={`text-xs mt-2 ${activeTab === 'effect' ? 'text-orange-500' : 'text-red-500'}`}>
                ※ このプロンプトは画像編集AI（GPT-4o, Geminiなど）で使用してください
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
