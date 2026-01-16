import { usePromptStore } from '../store/promptStore';

export function FreeTextInput() {
  const { freeText, setFreeText } = usePromptStore();

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <h2 className="text-sm font-medium text-gray-500 mb-3">フリーテキスト追加</h2>
      <textarea
        value={freeText}
        onChange={(e) => setFreeText(e.target.value)}
        placeholder="追加の詳細を入力（例：コーヒーカップを持っている、カメラ目線、笑顔）"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                   focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                   resize-none h-20"
      />
      <p className="text-xs text-gray-400 mt-1">
        プロンプトの末尾に追加されます
      </p>
    </div>
  );
}
