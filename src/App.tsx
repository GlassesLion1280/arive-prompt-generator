import { useState } from 'react';
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
import { GiraGiraPage } from './pages/GiraGiraPage';

type AppPage = 'generator' | 'giragira';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('generator');

  return (
    <>
      {/* グローバルナビゲーション */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage('generator')}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-all
                ${currentPage === 'generator'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              プロンプト生成
            </button>
            <button
              onClick={() => setCurrentPage('giragira')}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-all
                ${currentPage === 'giragira'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              ギラギラくん ✨
            </button>
          </div>
        </div>
      </div>

      {/* ページコンテンツ */}
      {currentPage === 'generator' ? (
        <MainLayout>
          <div className="space-y-4">
            <ModelSelector />

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex flex-wrap items-center gap-4">
                <LanguageToggle />
                <NegativePromptToggle />
                <ImageCountSelector />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-4">
                <ThumbnailTextInput />
                <CategoryPanel />
                <FreeTextInput />
              </div>
              <div className="space-y-4">
                <GachaPanel />
                <PromptOutput />
                <FavoritesPanel />
                <TemplatesPanel />
              </div>
            </div>
          </div>
        </MainLayout>
      ) : (
        <GiraGiraPage />
      )}
    </>
  );
}

export default App;
