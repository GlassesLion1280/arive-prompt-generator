import { ToggleButton } from './common/ToggleButton';
import { useGachaStore } from '../store/gachaStore';
import type { PromptOption } from '../types';

interface OptionButtonGridProps {
  categoryId: string;
  options: PromptOption[];
  selectedIds: string[];
  onToggle: (optionId: string) => void;
}

export function OptionButtonGrid({ categoryId, options, selectedIds, onToggle }: OptionButtonGridProps) {
  const { isExcluded, toggleExclude } = useGachaStore();

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <ToggleButton
          key={option.id}
          label={option.labelJa}
          isSelected={selectedIds.includes(option.id)}
          onClick={() => onToggle(option.id)}
          isExcluded={isExcluded(categoryId, option.id)}
          onExclude={() => toggleExclude(categoryId, option.id)}
        />
      ))}
    </div>
  );
}
