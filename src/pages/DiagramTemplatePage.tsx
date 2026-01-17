import { useState, useMemo, useCallback } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ModelSelector } from '../components/ModelSelector';
import { Accordion } from '../components/common/Accordion';
import { usePromptStore } from '../store/promptStore';
import { useHistoryStore } from '../store/historyStore';
import { useGiraGiraFavoritesStore } from '../store/giraGiraFavoritesStore';
import {
  DIAGRAM_TEMPLATES,
  DIAGRAM_CATEGORY_LABELS,
  getAllDiagramCategories,
  getTemplatesByCategory,
} from '../data/diagramTemplates';
import type { DiagramCategory, DiagramTemplate } from '../data/diagramTemplates';

export function DiagramTemplatePage() {
  const [selectedTemplate, setSelectedTemplate] = useState<DiagramTemplate | null>(null);
  const [titleText, setTitleText] = useState('');
  const [subText, setSubText] = useState('');
  const [contentText, setContentText] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<DiagramCategory[]>([]);
  const { selectedModel } = usePromptStore();

  // 履歴・お気に入りstore
  const {
    diagramHistory,
    addDiagramHistory,
    removeDiagramHistory,
    clearDiagramHistory,
  } = useHistoryStore();
  const {
    diagramFavorites,
    addDiagramFavorite,
    removeDiagramFavorite,
  } = useGiraGiraFavoritesStore();

  // 履歴・お気に入りパネルの状態
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [newFavoriteName, setNewFavoriteName] = useState('');
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Nanobanana Pro以外は使用不可
  const isEnabled = selectedModel === 'nanobanana-thumb';

  // プロンプト生成
  const generatedPrompt = useMemo(() => {
    if (!selectedTemplate) return '';

    const parts: string[] = [];

    // テンプレートのプロンプト
    parts.push(selectedTemplate.promptEn);

    // タイトルテキスト
    if (titleText.trim()) {
      parts.push(`title text "${titleText.trim()}"`);
    }

    // サブテキスト
    if (subText.trim()) {
      parts.push(`subtitle "${subText.trim()}"`);
    }

    // 本文テキスト
    if (contentText.trim()) {
      parts.push(`content text "${contentText.trim()}"`);
    }

    // 共通の品質指定
    parts.push('clean professional infographic design, high quality, readable text');

    return parts.join(', ');
  }, [selectedTemplate, titleText, subText, contentText]);

  // アコーディオントグル
  const toggleCategory = useCallback((category: DiagramCategory) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  }, []);

  // 全て閉じる
  const collapseAll = useCallback(() => {
    setExpandedCategories([]);
  }, []);

  // リセット
  const resetAll = useCallback(() => {
    setSelectedTemplate(null);
    setTitleText('');
    setSubText('');
    setContentText('');
  }, []);

  // コピー
  const copyPrompt = useCallback(async () => {
    if (generatedPrompt && selectedTemplate) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);

        // 履歴に保存
        addDiagramHistory({
          templateId: selectedTemplate.id,
          templateLabelJa: selectedTemplate.labelJa,
          titleText,
          subText,
          contentText,
          fullPrompt: generatedPrompt,
        });
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }, [generatedPrompt, selectedTemplate, titleText, subText, contentText, addDiagramHistory]);

  // 履歴から読み込み
  const loadFromHistory = useCallback((item: typeof diagramHistory[0]) => {
    const template = DIAGRAM_TEMPLATES.find(t => t.id === item.templateId);
    if (template) {
      setSelectedTemplate(template);
      setTitleText(item.titleText);
      setSubText(item.subText);
      setContentText(item.contentText);
    }
  }, []);

  // お気に入りから読み込み
  const loadFromFavorite = useCallback((fav: typeof diagramFavorites[0]) => {
    const template = DIAGRAM_TEMPLATES.find(t => t.id === fav.templateId);
    if (template) {
      setSelectedTemplate(template);
      setTitleText(fav.titleText);
      setSubText(fav.subText);
      setContentText(fav.contentText);
    }
  }, []);

  // お気に入りに保存
  const handleSaveFavorite = useCallback(() => {
    if (!newFavoriteName.trim() || !selectedTemplate) return;

    addDiagramFavorite({
      name: newFavoriteName.trim(),
      templateId: selectedTemplate.id,
      templateLabelJa: selectedTemplate.labelJa,
      titleText,
      subText,
      contentText,
    });

    setNewFavoriteName('');
    setIsAddingFavorite(false);
  }, [newFavoriteName, selectedTemplate, titleText, subText, contentText, addDiagramFavorite]);

  // 日時フォーマット
  const formatDate = useCallback((timestamp: number) => {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  }, []);

  // カテゴリ一覧
  const categories = getAllDiagramCategories();

  // 開いているカテゴリ数
  const openedCount = expandedCategories.length;

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* モデル選択 */}
        <ModelSelector />

        {/* Nanobanana Pro以外の場合は警告表示 */}
        {!isEnabled && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-amber-800">
                  Nanobanana Pro専用機能です
                </h3>
                <p className="text-xs text-amber-600 mt-1">
                  図解テンプレート機能を使用するには、モデル選択で「Nanobanana Pro (サムネイル)」を選択してください。
                </p>
              </div>
            </div>
          </div>
        )}


        {/* メインコンテンツ */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-4 ${!isEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* 左カラム：テンプレート選択 */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* テキスト入力 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h2 className="text-sm font-medium text-gray-500 mb-3">テキスト入力</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    タイトル（メイン見出し）
                  </label>
                  <input
                    type="text"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="例: 3つのポイント"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    サブテキスト（補足、任意）
                  </label>
                  <input
                    type="text"
                    value={subText}
                    onChange={(e) => setSubText(e.target.value)}
                    placeholder="例: 成功の秘訣を解説"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    本文（図解に含めたい内容を入力）
                  </label>
                  <textarea
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    placeholder="例: ポイント1: 早起きする / ポイント2: 運動する / ポイント3: 読書する"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    箇条書きや改行で入力すると見やすくなります
                  </p>
                </div>
              </div>
            </div>

            {/* テンプレート選択パネル */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-gray-500">
                  テンプレート選択
                  <span className="ml-2 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                    {DIAGRAM_TEMPLATES.length}種類
                  </span>
                </h2>
                {openedCount > 0 && (
                  <button
                    onClick={collapseAll}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    すべて閉じる
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {categories.map((category) => {
                  const templates = getTemplatesByCategory(category);
                  const isOpen = expandedCategories.includes(category);
                  const categoryLabel = DIAGRAM_CATEGORY_LABELS[category];

                  return (
                    <Accordion
                      key={category}
                      title={`${categoryLabel.ja} (${templates.length})`}
                      isOpen={isOpen}
                      onToggle={() => toggleCategory(category)}
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {templates.map((template) => {
                          const isSelected = selectedTemplate?.id === template.id;
                          return (
                            <button
                              key={template.id}
                              onClick={() => setSelectedTemplate(isSelected ? null : template)}
                              className={`
                                p-2 rounded-lg text-xs text-left transition-all
                                ${isSelected
                                  ? 'bg-purple-500 text-white shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                }
                              `}
                            >
                              <div className="font-medium truncate">{template.labelJa}</div>
                              <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-purple-100' : 'text-gray-500'}`}>
                                {template.description}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </Accordion>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 右カラム：プロンプト出力 */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* 選択中のテンプレート */}
              {selectedTemplate && (
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <h3 className="text-sm font-medium text-purple-700 mb-2">
                    選択中のテンプレート
                  </h3>
                  <div className="bg-white rounded-lg p-3">
                    <div className="font-medium text-gray-800">{selectedTemplate.labelJa}</div>
                    <div className="text-xs text-gray-500 mt-1">{selectedTemplate.description}</div>
                    <div className="text-xs text-purple-600 mt-2">
                      カテゴリ: {DIAGRAM_CATEGORY_LABELS[selectedTemplate.category].ja}
                    </div>
                  </div>
                </div>
              )}

              {/* プロンプト出力 */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-gray-500">
                    生成プロンプト
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={copyPrompt}
                      disabled={!generatedPrompt}
                      className={`flex items-center gap-1 px-3 py-1.5 text-white text-xs rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                        copySuccess ? 'bg-green-500' : 'bg-purple-500 hover:bg-purple-600'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {copySuccess ? 'コピー完了!' : 'コピー'}
                    </button>
                    <button
                      onClick={resetAll}
                      className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      リセット
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 min-h-[150px] max-h-[300px] overflow-y-auto">
                  {generatedPrompt ? (
                    <p className="text-sm text-gray-700 font-mono whitespace-pre-wrap break-words">
                      {generatedPrompt}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
                      テンプレートを選択するとプロンプトが生成されます
                    </p>
                  )}
                </div>
              </div>

              {/* 履歴パネル */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">🕐</span>
                    <span className="text-sm font-medium text-gray-700">
                      履歴 ({diagramHistory.length}/30)
                    </span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {isHistoryExpanded ? '▲' : '▼'}
                  </span>
                </button>

                {isHistoryExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {diagramHistory.length > 0 && (
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={clearDiagramHistory}
                          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                        >
                          すべて削除
                        </button>
                      </div>
                    )}

                    {diagramHistory.length > 0 ? (
                      <div className="mt-2 space-y-2 max-h-[200px] overflow-y-auto">
                        {diagramHistory.map((item) => (
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
                                  {item.templateLabelJa}
                                </p>
                                {item.titleText && (
                                  <p className="text-xs text-gray-500 truncate">
                                    「{item.titleText}」
                                  </p>
                                )}
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
                                  onClick={() => removeDiagramHistory(item.id)}
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

              {/* お気に入りパネル */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <button
                  onClick={() => setIsFavoritesExpanded(!isFavoritesExpanded)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium text-gray-700">
                      お気に入り ({diagramFavorites.length})
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
                                     focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveFavorite();
                              if (e.key === 'Escape') setIsAddingFavorite(false);
                            }}
                          />
                          <button
                            onClick={handleSaveFavorite}
                            disabled={!newFavoriteName.trim()}
                            className="px-3 py-1.5 text-sm bg-purple-500 text-white rounded-lg
                                     hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
                          disabled={!selectedTemplate}
                          className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg
                                   hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          ＋ 現在の選択を保存
                        </button>
                      )}
                    </div>

                    {/* お気に入りリスト */}
                    {diagramFavorites.length > 0 ? (
                      <div className="mt-3 space-y-2 max-h-[200px] overflow-y-auto">
                        {diagramFavorites.map((fav) => (
                          <div
                            key={fav.id}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
                          >
                            <button
                              onClick={() => loadFromFavorite(fav)}
                              className="flex-1 text-left text-sm text-gray-700 hover:text-purple-600 truncate"
                              title={`読み込む: ${fav.name}`}
                            >
                              {fav.name}
                            </button>
                            <button
                              onClick={() => removeDiagramFavorite(fav.id)}
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

              {/* ヒント */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <h3 className="text-sm font-medium text-purple-700 mb-2">
                  💡 使い方ヒント
                </h3>
                <ul className="text-xs text-purple-600 space-y-1">
                  <li>• テンプレート + デザインスタイルを組み合わせ</li>
                  <li>• タイトルは短く明確に</li>
                  <li>• Nanobanana Proで最適化された出力</li>
                  <li>• プロンプト生成ページと併用可能</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
