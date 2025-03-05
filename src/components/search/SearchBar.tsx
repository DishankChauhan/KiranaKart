import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInventoryStore } from '../../store/inventoryStore';

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export interface SearchFilters {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
  sortBy: 'price' | 'name' | 'popularity';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    priceRange: [0, 1000],
    inStock: false,
    sortBy: 'name'
  });

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query, filters);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, filters, onSearch]);

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-lg shadow-md space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="dairy">Dairy</option>
              <option value="meat">Meat</option>
              <option value="beverages">Beverages</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [Number(e.target.value), filters.priceRange[1]]
                })}
                placeholder="Min"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters({
                  ...filters,
                  priceRange: [filters.priceRange[0], Number(e.target.value)]
                })}
                placeholder="Max"
                className="w-1/2 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
              className="h-4 w-4 text-emerald-600 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              In Stock Only
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({
                ...filters,
                sortBy: e.target.value as 'price' | 'name' | 'popularity'
              })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="popularity">Popularity</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;