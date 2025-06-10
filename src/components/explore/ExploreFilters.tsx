import { ChangeEvent } from 'react';
import { Filter, Search } from 'lucide-react';
import { categoriesAPI } from '../../store/api/categories';
import { IRequestGetDest } from '../../models/destinations';

interface ExploreFiltersProps {
  filters: IRequestGetDest;
  onFilterChange: (name: keyof IRequestGetDest, value: string | string[] | number[] | number) => void;
}

const priceRanges = ['$', '$$', '$$$'];

export function ExploreFilters({ filters, onFilterChange }: ExploreFiltersProps) {
  const { data: categories } = categoriesAPI.useFetchCategoriesQuery();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFilterChange('query', e.target.value);
  };

  const handleCategoryChange = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    onFilterChange('categories', newCategories);
  };

  const handlePriceChange = (price: string) => {
    const newPrices = filters.price.includes(price)
      ? filters.price.filter(p => p !== price)
      : [...filters.price, price];
    onFilterChange('price', newPrices);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-4">
            <Search className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Search</h3>
          </div>
          <input
            type="text"
            value={filters.query}
            onChange={handleSearchChange}
            placeholder="Search destinations..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <div className="flex items-center mb-4">
            <Filter className="w-5 h-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold">Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(categories || []).map(item => (
              <button
                key={item.id}
                onClick={() => handleCategoryChange(item.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.categories.includes(item.id)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <div className="flex gap-2">
            {priceRanges.map(price => (
              <button
                key={price}
                onClick={() => handlePriceChange(price)}
                className={`px-4 py-2 rounded-md text-sm ${
                  filters.price.includes(price)
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {price}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}