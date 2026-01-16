import { usePromptStore } from '../store/promptStore';
import { AI_MODELS } from '../data/models';

export function NegativePromptToggle() {
  const { showNegativePrompt, setShowNegativePrompt, selectedModel } = usePromptStore();

  // ネガティブプロンプトをサポートしているモデルかチェック
  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);
  const supportsNegative = currentModel?.supportedFeatures.negativePrompt ?? false;

  if (!supportsNegative) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showNegativePrompt}
          onChange={(e) => setShowNegativePrompt(e.target.checked)}
          className="w-4 h-4 text-primary-500 border-gray-300 rounded
                     focus:ring-primary-500 cursor-pointer"
        />
        <span className="text-sm text-gray-700">ネガティブプロンプトを出力</span>
      </label>
    </div>
  );
}
