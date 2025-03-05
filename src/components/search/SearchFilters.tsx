import React from 'react';
import { Filter, MapPin, DollarSign } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    category: string;
    priceRange: [number, number];
    distance: number;
    inStock: boolean;
  };
  onFilterChange: (filters: any) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const categories = ['all', 'fruits', 'vegetables', 'dairy', 'meat', 'beverages', 'snacks'];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="0"
            value={filters.priceRange[0]}
            onChange={(e) => onFilterChange({
              ...filters,
              priceRange: [Number(e.target.value), filters.priceRange[1]]
            })}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
            placeholder="Min"
          />
          <input
            type="number"
            min="0"
            value={filters.priceRange[1]}
            onChange={(e) => onFilterChange({
              ...filters,
              priceRange: [filters.priceRange[0], Number(e.target.value)]
            })}
            className="w-1/2 p-2 border border-gray-300 rounded-md"
            placeholder="Max"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Distance (km)
        </label>
        <input
          type="range"
          min="1"
          max="50"
          value={filters.distance}
          onChange={(e) => onFilterChange({ ...filters, distance: Number(e.target.value) })}
          className="w-full"
        />
        <div className="text-sm text-gray-600 mt-1">
          Within {filters.distance} km
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={filters.inStock}
          onChange={(e) => onFilterChange({ ...filters, inStock: e.target.checked })}
          className="h-4 w-4 text-emerald-600 rounded"
        />
        <label className="ml-2 text-sm text-gray-700">
          In Stock Only
        </label>
      </div>
    </div>
  );
};

export default SearchFilters;