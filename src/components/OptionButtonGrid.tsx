import { ToggleButton } from './common/ToggleButton';
import type { PromptOption } from '../types';

interface OptionButtonGridProps {
  options: PromptOption[];
  selectedIds: string[];
  onToggle: (optionId: string) => void;
}

export function OptionButtonGrid({ options, selectedIds, onToggle }: OptionButtonGridProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <ToggleButton
          key={option.id}
          label={option.labelJa}
          isSelected={selectedIds.includes(option.id)}
          onClick={() => onToggle(option.id)}
        />
      ))}
    </div>
  );
}
