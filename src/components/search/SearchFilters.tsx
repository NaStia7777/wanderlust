import { Dispatch, SetStateAction } from 'react';
import { Filter } from 'lucide-react';
import { categories } from '../../data/categories';

interface SearchFiltersProps {
  selectCategories: Set<string>,
  setSelectCategories: Dispatch<SetStateAction<Set<string>>>,
}

export function SearchFilters({ selectCategories, setSelectCategories }: SearchFiltersProps) {
  function handleChange(id: string): void {
    setSelectCategories(prev=>{
      const newSet = new Set(prev);
      if(newSet.has(id))
        newSet.delete(id);
      else
        newSet.add(id);
      return newSet;
    });
  }

  return (
    <div className="bg-white rounded-lg shadow-md py-4 px-6 mb-3">
      <div className="flex items-center mb-1">
        <Filter className="w-5 h-5 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold">Filters</h3>
      </div>
      <div className="space-y-1">        
        {categories.map(item =>
        <label className="flex items-center space-x-2" key={item.id}>
          <input
            type="checkbox"
            checked={selectCategories.has(item.id)}
            onChange={()=>handleChange(item.id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <span>{item.name}</span>
        </label>
        )}
      </div>
    </div>
  );
}