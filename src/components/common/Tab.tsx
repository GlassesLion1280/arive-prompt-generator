interface TabItem {
  id: string;
  label: string;
  badge?: number;
}

interface TabProps {
  items: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  size?: 'sm' | 'md';
}

export function Tab({ items, activeId, onSelect, size = 'md' }: TabProps) {
  const sizeClasses = size === 'sm' ? 'px-3 py-1.5 text-sm' : 'px-4 py-2';

  return (
    <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect(item.id)}
          className={`
            ${sizeClasses} rounded-md font-medium transition-all duration-200
            flex items-center gap-1.5
            ${
              activeId === item.id
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          {item.label}
          {item.badge !== undefined && item.badge > 0 && (
            <span className={`
              min-w-[18px] h-[18px] px-1 rounded-full text-xs font-medium
              flex items-center justify-center
              ${activeId === item.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-300 text-gray-700'
              }
            `}>
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
