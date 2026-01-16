import { useState } from 'react';
import { usePromptStore } from '../store/promptStore';

const PRESET_COUNTS = [1, 2, 3, 4];

export function ImageCountSelector() {
  const { imageCount, setImageCount } = usePromptStore();
  const [customValue, setCustomValue] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // プリセット以外の値が設定されているかチェック
  const isCustomValue = !PRESET_COUNTS.includes(imageCount) && imageCount > 0;

  const handlePresetClick = (value: number) => {
    setImageCount(value);
    setShowCustomInput(false);
    setCustomValue('');
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 数字のみ許可
    if (value === '' || /^\d+$/.test(value)) {
      setCustomValue(value);
    }
  };

  const handleCustomInputBlur = () => {
    if (customValue) {
      const num = parseInt(customValue, 10);
      if (num >= 1) {
        setImageCount(num);
      }
    }
  };

  const handleCustomInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCustomInputBlur();
      setShowCustomInput(false);
    }
    if (e.key === 'Escape') {
      setShowCustomInput(false);
      setCustomValue('');
    }
  };

  const toggleCustomInput = () => {
    if (showCustomInput) {
      setShowCustomInput(false);
      setCustomValue('');
    } else {
      setShowCustomInput(true);
      setCustomValue(isCustomValue ? String(imageCount) : '');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">出力枚数:</span>
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
        {PRESET_COUNTS.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handlePresetClick(value)}
            className={`
              px-3 py-1 text-sm rounded-md font-medium transition-all duration-200
              ${
                imageCount === value && !showCustomInput
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {value}枚
          </button>
        ))}

        {/* カスタム入力トグル */}
        <button
          type="button"
          onClick={toggleCustomInput}
          className={`
            px-2 py-1 text-sm rounded-md font-medium transition-all duration-200
            ${
              isCustomValue || showCustomInput
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }
          `}
          title="任意の枚数を入力"
        >
          {isCustomValue && !showCustomInput ? `${imageCount}枚` : '...'}
        </button>
      </div>

      {/* カスタム入力フィールド */}
      {showCustomInput && (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={customValue}
            onChange={handleCustomInputChange}
            onBlur={handleCustomInputBlur}
            onKeyDown={handleCustomInputKeyDown}
            placeholder="枚数"
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-md
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            autoFocus
          />
          <span className="text-sm text-gray-500">枚</span>
        </div>
      )}
    </div>
  );
}
