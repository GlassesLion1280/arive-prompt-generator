import { Accordion } from './common/Accordion';
import { OptionButtonGrid } from './OptionButtonGrid';
import { usePromptStore } from '../store/promptStore';
import type { SubCategory } from '../types';

interface SubCategoryAccordionProps {
  category: SubCategory;
}

export function SubCategoryAccordion({ category }: SubCategoryAccordionProps) {
  const { selectedOptions, toggleOption, expandedSubCategories, toggleSubCategory } =
    usePromptStore();

  const isOpen = expandedSubCategories.includes(category.id);
  const selectedIds = selectedOptions[category.id] || [];
  const selectedCount = selectedIds.length;

  const title = selectedCount > 0 ? `${category.labelJa} (${selectedCount})` : category.labelJa;

  return (
    <Accordion title={title} isOpen={isOpen} onToggle={() => toggleSubCategory(category.id)}>
      <OptionButtonGrid
        categoryId={category.id}
        options={category.options}
        selectedIds={selectedIds}
        onToggle={(optionId) => toggleOption(category.id, optionId)}
      />
    </Accordion>
  );
}
