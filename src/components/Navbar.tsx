import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Store, LogOut, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import DarkModeToggle from './common/DarkModeToggle';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Store className="h-8 w-8 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">KiranaKart</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-emerald-600">
              Home
            </Link>
            <Link to="/browse" className="text-gray-600 hover:text-emerald-600">
              Browse
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-emerald-600">
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <DarkModeToggle />
            
            {user ? (
              <>
                {user.role === 'store_owner' ? (
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-emerald-600"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/browse"
                    className="text-gray-600 hover:text-emerald-600"
                  >
                    Browse Stores
                  </Link>
                )}

                {user.role === 'customer' && (
                  <Link to="/cart" className="relative p-2">
                    <ShoppingCart className="h-6 w-6 text-gray-600 hover:text-emerald-600" />
                    {items.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {items.length}
                      </span>
                    )}
                  </Link>
                )}

                <Link to="/profile" className="text-gray-600 hover:text-emerald-600">
                  <User className="h-6 w-6" />
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-emerald-600"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <DarkModeToggle />
            
            {user && user.role === 'customer' && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-2 space-y-3">
              <Link to="/" className="block py-2 text-gray-600 hover:text-emerald-600">
                Home
              </Link>
              <Link to="/browse" className="block py-2 text-gray-600 hover:text-emerald-600">
                Browse
              </Link>
              <Link to="/about" className="block py-2 text-gray-600 hover:text-emerald-600">
                About
              </Link>
              <Link to="/contact" className="block py-2 text-gray-600 hover:text-emerald-600">
                Contact
              </Link>
              
              {user ? (
                <>
                  {user.role === 'store_owner' && (
                    <Link to="/dashboard" className="block py-2 text-gray-600 hover:text-emerald-600">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/profile" className="block py-2 text-gray-600 hover:text-emerald-600">
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 text-gray-600 hover:text-emerald-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block py-2 text-gray-600 hover:text-emerald-600">
                    Sign In
                  </Link>
                  <Link to="/register" className="block py-2 text-emerald-600 hover:text-emerald-700 font-medium">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;