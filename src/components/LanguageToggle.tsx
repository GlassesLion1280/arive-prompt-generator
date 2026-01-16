import { usePromptStore, type OutputLanguage } from '../store/promptStore';
import { AI_MODELS } from '../data/models';

export function LanguageToggle() {
  const { outputLanguage, setOutputLanguage, selectedModel } = usePromptStore();

  // 日本語出力をサポートしているモデルかチェック
  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);
  const supportsJapanese = currentModel?.supportedFeatures.japaneseOutput ?? false;

  if (!supportsJapanese) {
    return null;
  }

  const languages: { id: OutputLanguage; label: string }[] = [
    { id: 'en', label: '英語' },
    { id: 'ja', label: '日本語' },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">出力言語:</span>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {languages.map((lang) => (
          <button
            key={lang.id}
            type="button"
            onClick={() => setOutputLanguage(lang.id)}
            className={`
              px-3 py-1 text-sm rounded-md font-medium transition-all duration-200
              ${
                outputLanguage === lang.id
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
