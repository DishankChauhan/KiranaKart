import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Login from './pages/Login';
import Register from './pages/Register';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import CustomerProfile from './pages/CustomerProfile';
import OrderHistory from './pages/OrderHistory';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuthStore } from './store/authStore';
import { useDarkMode } from './hooks/useDarkMode';

const App = () => {
  const { initialize } = useAuthStore();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Navbar />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDarkMode ? '#374151' : '#fff',
            color: isDarkMode ? '#fff' : '#374151',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/store/:storeId" element={<StorePage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['store_owner']}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['customer', 'store_owner']}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;