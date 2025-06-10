import { useState } from "react";
import { categories } from "../../../data/categories";
import { CategoryNode, getAllChildIds, getParentIds } from "./logic";

export interface ICategoryTreeProps {
    category: CategoryNode;
    selectedCategories: Set<string>;
    onToggle: (allChildIds: string[], parentIds: string[]) => void;
    level?: number;
}

export default function CategoryTree({ category, selectedCategories, onToggle, level = 0 }: ICategoryTreeProps) {
    const [isExpanded, setIsExpanded] = useState(category.id === 'interesting_places');
    const hasChildren = category.children && category.children.length > 0;

    const allChildIds = getAllChildIds(category);
    const allSelected = allChildIds.every(id => selectedCategories.has(id));
    const someSelected = allChildIds.some(id => selectedCategories.has(id));

    const handleToggle = () => {
        const parentIds = categories.flatMap(rootCat => getParentIds(category.id, rootCat));
        onToggle(allChildIds, parentIds);
    };

    return (
        <div className="ml-4">
            <div className="flex items-center py-1">
                {hasChildren && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mr-2 text-gray-500 hover:text-gray-700"
                    >
                        {isExpanded ? '−' : '+'}
                    </button>
                )}
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        ref={input => {
                            if (input) {
                                input.indeterminate = someSelected && !allSelected;
                            }
                        }}
                        onChange={handleToggle}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{category.name}</span>
                </label>
            </div>
            {isExpanded && hasChildren && (
                <div className="ml-2">
                    {category.children?.map((child) => (
                        <CategoryTree
                            key={child.id}
                            category={child}
                            selectedCategories={selectedCategories}
                            onToggle={onToggle}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}