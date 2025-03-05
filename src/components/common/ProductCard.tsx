import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useDarkMode } from '../../hooks/useDarkMode';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string;
    category: string;
    quantity: number;
  };
  onAddToCart: () => void;
  onAddToWishlist: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onAddToWishlist }) => {
  const { isDarkMode } = useDarkMode();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`rounded-lg overflow-hidden shadow-lg ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div className="relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className={`w-full h-48 flex items-center justify-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <ShoppingCart className={`w-12 h-12 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
          </div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAddToWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white"
        >
          <Heart className="w-5 h-5 text-red-500" />
        </motion.button>
      </div>

      <div className="p-4">
        <h3 className={`font-semibold text-lg mb-2 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {product.name}
        </h3>
        <p className={`text-sm mb-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {product.category}
        </p>
        <div className="flex justify-between items-center">
          <span className={`text-lg font-bold ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            ₹{product.price}
          </span>
          <span className={`text-sm ${
            product.quantity > 0 
              ? isDarkMode ? 'text-green-400' : 'text-green-600'
              : isDarkMode ? 'text-red-400' : 'text-red-600'
          }`}>
            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onAddToCart}
          disabled={product.quantity === 0}
          className={`w-full mt-4 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
            product.quantity > 0
              ? `${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600'} text-white hover:bg-emerald-700`
              : `${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} text-gray-500 cursor-not-allowed`
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;