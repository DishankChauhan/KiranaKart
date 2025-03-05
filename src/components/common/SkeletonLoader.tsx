import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';

interface SkeletonLoaderProps {
  count?: number;
  type: 'product' | 'text' | 'circle';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 1, type }) => {
  const { isDarkMode } = useDarkMode();

  const renderSkeleton = () => {
    switch (type) {
      case 'product':
        return (
          <div className={`rounded-lg overflow-hidden shadow-lg ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`w-full h-48 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
            } animate-pulse`} />
            <div className="p-4 space-y-3">
              <div className={`h-6 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              } rounded animate-pulse`} />
              <div className={`h-4 w-2/3 ${
                isDarkMode } rounded animate-pulse`} />
              <div className={`h-8 ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              } rounded animate-pulse`} />
            </div>
          </div>
        );
      case 'text':
        return (
          <div className={`h-4 ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          } rounded animate-pulse`} />
        );
      case 'circle':
        return (
          <div className={`w-12 h-12 rounded-full ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
          } animate-pulse`} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {renderSkeleton()}
        </motion.div>
      ))}
    </>
  );
};

export default SkeletonLoader;