import { usePromptStore, type TextVerticalPosition, type TextHorizontalPosition, type ThumbnailTextLine } from '../store/promptStore';

// 位置ラベルの定義
const VERTICAL_POSITIONS: { value: TextVerticalPosition; label: string }[] = [
  { value: 'top', label: '上' },
  { value: 'center', label: '中央' },
  { value: 'bottom', label: '下' },
];

const HORIZONTAL_POSITIONS: { value: TextHorizontalPosition; label: string }[] = [
  { value: 'left', label: '左' },
  { value: 'center', label: '中央' },
  { value: 'right', label: '右' },
];

// 位置を日本語で説明する関数
const getPositionLabel = (v: TextVerticalPosition, h: TextHorizontalPosition): string => {
  const vLabel = VERTICAL_POSITIONS.find((p) => p.value === v)?.label ?? '';
  const hLabel = HORIZONTAL_POSITIONS.find((p) => p.value === h)?.label ?? '';
  if (v === 'center' && h === 'center') return '中央';
  if (v === 'center') return hLabel;
  if (h === 'center') return vLabel;
  return `${vLabel}${hLabel}`;
};

export function ThumbnailTextInput() {
  const { thumbnailText, setThumbnailText, selectedModel } = usePromptStore();

  // Nanobanana Pro (サムネイル) の時のみ表示
  if (selectedModel !== 'nanobanana-thumb') {
    return null;
  }

  const handleLineCountChange = (count: 1 | 2 | 3) => {
    setThumbnailText({
      ...thumbnailText,
      lineCount: count,
    });
  };

  const handleLineChange = (index: number, field: keyof ThumbnailTextLine, value: string) => {
    const newLines = [...thumbnailText.lines];
    newLines[index] = {
      ...newLines[index],
      [field]: value,
    };
    setThumbnailText({
      ...thumbnailText,
      lines: newLines,
    });
  };

  const clearAll = () => {
    setThumbnailText({
      lines: [
        { text: '', verticalPosition: 'center', horizontalPosition: 'center' },
        { text: '', verticalPosition: 'center', horizontalPosition: 'center' },
        { text: '', verticalPosition: 'center', horizontalPosition: 'center' },
      ],
      lineCount: thumbnailText.lineCount,
    });
  };

  // 入力されたテキストがあるかチェック
  const hasInput = thumbnailText.lines.some((line) => line.text.trim() !== '');

  // プレビュー用のテキスト生成
  const generatePreview = () => {
    const activeLines = thumbnailText.lines
      .slice(0, thumbnailText.lineCount)
      .filter((line) => line.text.trim() !== '');

    if (activeLines.length === 0) return '';

    const parts = activeLines.map((line) => {
      const pos = getPositionLabel(line.verticalPosition, line.horizontalPosition);
      return `「${line.text}」を${pos}に`;
    });

    // 視認性向上の指示も含める
    const textStyleHint = '大きく太い文字、白い縁取り付き、視認性の高いテキスト';
    return `サムネイルに${parts.join('、')}配置、${textStyleHint}`;
  };

  return (
    <div className="bg-orange-50 rounded-xl p-4 shadow-sm border border-orange-200">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-orange-700">
          サムネイル テキスト入力
          <span className="ml-2 text-xs text-orange-500">（日本語OK）</span>
        </h2>
        {hasInput && (
          <button
            onClick={clearAll}
            className="text-xs text-orange-500 hover:text-orange-700 transition-colors"
          >
            クリア
          </button>
        )}
      </div>

      {/* 行数選択 */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs text-gray-600">テキスト数:</span>
        {([1, 2, 3] as const).map((count) => (
          <button
            key={count}
            onClick={() => handleLineCountChange(count)}
            className={`
              px-3 py-1 text-xs rounded-lg transition-all
              ${thumbnailText.lineCount === count
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-600 hover:bg-orange-100 border border-gray-300'
              }
            `}
          >
            {count}つ
          </button>
        ))}
      </div>

      {/* テキスト入力フィールド */}
      <div className="space-y-3">
        {Array.from({ length: thumbnailText.lineCount }).map((_, index) => {
          const line = thumbnailText.lines[index];
          return (
            <div key={index} className="bg-white rounded-lg p-3 border border-orange-100">
              {/* テキスト入力 */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-orange-600 w-8">#{index + 1}</span>
                <input
                  type="text"
                  value={line?.text || ''}
                  onChange={(e) => handleLineChange(index, 'text', e.target.value)}
                  placeholder={`テキスト ${index + 1} を入力...`}
                  className="flex-1 px-3 py-2 border border-orange-200 rounded-lg text-sm
                             focus:ring-2 focus:ring-orange-400 focus:border-orange-400
                             placeholder:text-gray-400"
                />
              </div>

              {/* 位置選択 */}
              <div className="flex items-center gap-4 ml-8">
                {/* 縦位置 */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">縦:</span>
                  <div className="flex gap-1">
                    {VERTICAL_POSITIONS.map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => handleLineChange(index, 'verticalPosition', pos.value)}
                        className={`
                          px-2 py-0.5 text-xs rounded transition-all
                          ${line?.verticalPosition === pos.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                          }
                        `}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 横位置 */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">横:</span>
                  <div className="flex gap-1">
                    {HORIZONTAL_POSITIONS.map((pos) => (
                      <button
                        key={pos.value}
                        onClick={() => handleLineChange(index, 'horizontalPosition', pos.value)}
                        className={`
                          px-2 py-0.5 text-xs rounded transition-all
                          ${line?.horizontalPosition === pos.value
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                          }
                        `}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 現在の位置表示 */}
                <span className="text-xs text-orange-600 ml-auto">
                  → {getPositionLabel(line?.verticalPosition || 'center', line?.horizontalPosition || 'center')}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* プレビュー */}
      {hasInput && (
        <div className="mt-3 p-2 bg-white rounded-lg border border-orange-100">
          <p className="text-xs text-gray-500 mb-1">プロンプトに追加される内容:</p>
          <p className="text-xs text-orange-700 font-medium">
            {generatePreview()}
          </p>
        </div>
      )}

      <p className="text-xs text-orange-600 mt-2">
        各テキストの配置位置を指定できます。Nanobanana Proが位置を考慮して画像を生成します。
      </p>
    </div>
  );
}
