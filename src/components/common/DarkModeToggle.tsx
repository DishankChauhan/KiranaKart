import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks/useDarkMode';

const DarkModeToggle: React.FC = () => {
  const { isDarkMode, toggle } = useDarkMode();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className={`p-2 rounded-full ${
        isDarkMode ? 'bg-gray-800 text-yellow-300' : 'bg-gray-100 text-gray-800'
      }`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </motion.button>
  );
};

export default DarkModeToggle;