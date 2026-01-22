import { useRef, useCallback } from 'react';

interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  isExcluded?: boolean;
  onExclude?: () => void;
}

export function ToggleButton({
  label,
  isSelected,
  onClick,
  isExcluded = false,
  onExclude,
}: ToggleButtonProps) {
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handleMouseDown = useCallback(() => {
    if (!onExclude) return;

    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      onExclude();
    }, 500);
  }, [onExclude]);

  const handleMouseUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleClick = useCallback(() => {
    // 長押しが発火した場合はクリックを無視
    if (isLongPress.current) {
      isLongPress.current = false;
      return;
    }
    onClick();
  }, [onClick]);

  // スタイルの決定
  const getButtonClasses = () => {
    const baseClasses = 'px-3 py-2 text-sm rounded-lg border transition-all duration-200 select-none';

    if (isExcluded) {
      // 除外中のスタイル
      return `${baseClasses} bg-red-50 text-red-400 border-red-300 line-through`;
    }

    if (isSelected) {
      // 選択中のスタイル
      return `${baseClasses} bg-primary-500 text-white border-primary-500 shadow-md`;
    }

    // 通常のスタイル
    return `${baseClasses} bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:bg-primary-50`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      className={getButtonClasses()}
      title={onExclude ? '長押しで除外設定' : undefined}
    >
      {isExcluded ? (
        <span className="flex items-center gap-1">
          <span>{label}</span>
        </span>
      ) : (
        label
      )}
    </button>
  );
}
