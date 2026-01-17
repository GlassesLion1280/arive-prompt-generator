import { useState, useEffect } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { ModelSelector } from './components/ModelSelector';
import { CategoryPanel } from './components/CategoryPanel';
import { PromptOutput } from './components/PromptOutput';
import { FreeTextInput } from './components/FreeTextInput';
import { LanguageToggle } from './components/LanguageToggle';
import { NegativePromptToggle } from './components/NegativePromptToggle';
import { ImageCountSelector } from './components/ImageCountSelector';
import { FavoritesPanel } from './components/FavoritesPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { ThumbnailTextInput } from './components/ThumbnailTextInput';
import { GachaPanel } from './components/GachaPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { GiraGiraPage } from './pages/GiraGiraPage';
import { MaterialPage } from './pages/MaterialPage';
import { DiagramTemplatePage } from './pages/DiagramTemplatePage';

type AppPage = 'generator' | 'giragira' | 'material' | 'diagram';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('generator');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // スクロール位置を監視してトップへ戻るボタンの表示を制御
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* グローバルナビゲーション */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => setCurrentPage('generator')}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                ${currentPage === 'generator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              プロンプト生成
            </button>
            <button
              onClick={() => setCurrentPage('material')}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                ${currentPage === 'material'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              素材生成
            </button>
            <button
              onClick={() => setCurrentPage('giragira')}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                ${currentPage === 'giragira'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              ギラギラくん
            </button>
            <button
              onClick={() => setCurrentPage('diagram')}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap
                ${currentPage === 'diagram'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              図解テンプレート
            </button>
          </div>
        </div>
      </div>

      {/* ページコンテンツ */}
      {currentPage === 'generator' && (
        <MainLayout>
          <div className="space-y-4">
            {/* 上部：モデル選択と設定 */}
            <ModelSelector />

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <LanguageToggle />
                <NegativePromptToggle />
                <ImageCountSelector />
              </div>
            </div>

            {/* メインコンテンツ：3カラム（大画面）/ 2カラム（中画面）/ 1カラム（小画面）*/}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* 左カラム：カテゴリ選択（スクロール可能） */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                <ThumbnailTextInput />
                <CategoryPanel />
                <FreeTextInput />
              </div>

              {/* 右カラム：ガチャ・出力・お気に入り（Sticky） */}
              <div className="lg:col-span-5 xl:col-span-4">
                <div className="lg:sticky lg:top-20 space-y-4 max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pb-4">
                  <GachaPanel />
                  <PromptOutput />
                  <HistoryPanel />
                  <FavoritesPanel />
                  <TemplatesPanel />
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      )}

      {currentPage === 'material' && <MaterialPage />}

      {currentPage === 'giragira' && <GiraGiraPage />}

      {currentPage === 'diagram' && <DiagramTemplatePage />}

      {/* フローティング「トップへ戻る」ボタン */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
          aria-label="トップへ戻る"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
}

export default App;
