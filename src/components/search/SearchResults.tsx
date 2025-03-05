import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ShoppingCart } from 'lucide-react';
import type { GroceryItem } from '../../types/inventory';

interface SearchResultsProps {
  items: GroceryItem[];
  onSubscribe: (itemId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ items, onSubscribe }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
        >
          {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{item.category}</p>
            
            <div className="mt-2 flex items-center justify-between">
              <span className="text-lg font-bold text-emerald-600">
                ${item.price.toFixed(2)}
              </span>
              <span className={`text-sm ${
                item.quantity > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of stock'}
              </span>
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span>2.5 km away</span>
            </div>

            <button
              onClick={() => onSubscribe(item.id)}
              className="mt-4 w-full py-2 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 flex items-center justify-center"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {item.quantity > 0 ? 'Add to Cart' : 'Notify When Available'}
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SearchResults;