import { useState } from 'react';
import { useEyeCandyStore, useFilteredEffects } from '../store/eyecandyStore';
import { EFFECT_CATEGORIES, type EffectCategory, getEffectCategory } from '../data/eyecandyEffects';

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
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 検索でさらにフィルタリング
  const displayedEffects = searchQuery.trim()
    ? filteredEffects.filter((effect) =>
        effect.titleJa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        effect.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredEffects;

  const handleCopy = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左カラム: エフェクト選択 */}
          <div className="lg:col-span-2 space-y-4">
            {/* カテゴリフィルター */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-3">
                カテゴリで絞り込み
              </h2>
              <div className="flex flex-wrap gap-2">
                {EFFECT_CATEGORIES.map((cat) => (
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
                ))}
              </div>
            </div>

            {/* エフェクト一覧 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500">
                  エフェクト選択
                  <span className="ml-2 text-xs text-gray-400">
                    ({displayedEffects.length}件{searchQuery && ` / ${filteredEffects.length}件中`})
                  </span>
                </h2>
                {selectedEffect && (
                  <button
                    onClick={resetAll}
                    className="text-xs text-orange-500 hover:text-orange-700"
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
                    placeholder="エフェクト名で検索..."
                    className="w-full px-3 py-2 pl-9 border border-gray-200 rounded-lg text-sm
                               focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                               placeholder:text-gray-400"
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
                {displayedEffects.map((effect) => {
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
                })}
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
                    onClick={() => setApplyScope('all')}
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${applyScope === 'all'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                      }
                    `}
                  >
                    全体に適用
                  </button>
                  <button
                    onClick={() => setApplyScope('partial')}
                    className={`
                      flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                      ${applyScope === 'partial'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                      }
                    `}
                  >
                    一部に適用
                  </button>
                </div>

                {/* 一部適用の場合のテキスト入力 */}
                {applyScope === 'partial' && (
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
              </div>
            </div>

            {/* プロンプト出力 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500">
                  生成されたプロンプト
                </h2>
                {generatedPrompt && (
                  <button
                    onClick={handleCopy}
                    className={`
                      px-3 py-1 rounded-lg text-sm font-medium transition-all
                      ${copySuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                      }
                    `}
                  >
                    {copySuccess ? 'コピー完了!' : 'コピー'}
                  </button>
                )}
              </div>

              {generatedPrompt ? (
                <div className="bg-gray-50 rounded-lg p-3 max-h-[300px] overflow-y-auto">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                    {generatedPrompt}
                  </pre>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm">
                    エフェクトを選択すると<br />プロンプトが表示されます
                  </p>
                </div>
              )}
            </div>

            {/* 使い方 */}
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <h3 className="text-sm font-medium text-orange-700 mb-2">
                使い方
              </h3>
              <ol className="text-xs text-orange-600 space-y-1 list-decimal list-inside">
                <li>エフェクトを選択</li>
                <li>全体/一部の適用範囲を選択</li>
                <li>プロンプトをコピー</li>
                <li>画像生成AIに画像と一緒に貼り付け</li>
              </ol>
              <p className="text-xs text-orange-500 mt-2">
                ※ このプロンプトは画像編集AI（GPT-4o, Geminiなど）で使用してください
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
