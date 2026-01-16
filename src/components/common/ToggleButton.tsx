interface ToggleButtonProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ToggleButton({ label, isSelected, onClick }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        px-3 py-2 text-sm rounded-lg border transition-all duration-200
        ${
          isSelected
            ? 'bg-primary-500 text-white border-primary-500 shadow-md'
            : 'bg-white text-gray-700 border-gray-300 hover:border-primary-400 hover:bg-primary-50'
        }
      `}
    >
      {label}
    </button>
  );
}
