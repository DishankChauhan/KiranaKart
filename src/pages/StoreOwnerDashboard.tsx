import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, Package, DollarSign, Users, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import InventoryTable from '../components/dashboard/InventoryTable';
import StoreProfile from '../components/store/StoreProfile';
import SalesChart from '../components/analytics/SalesChart';
import { useInventoryStore } from '../store/inventoryStore';
import { useAuthStore } from '../store/authStore';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { Store } from '../types/inventory';
import InventoryForm from '../components/inventory/InventoryForm';

const StoreOwnerDashboard = () => {
  const { user } = useAuthStore();
  const { items, loadStoreItems } = useInventoryStore();
  const [store, setStore] = useState<Store | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      if (!user?.id) return;

      try {
        const storeDoc = await getDoc(doc(db, 'stores', user.id));
        if (storeDoc.exists()) {
          const storeData = { id: storeDoc.id, ...storeDoc.data() } as Store;
          setStore(storeData);
          loadStoreItems(storeDoc.id);
        } else {
          // Create default store for new owners
          const newStore: Omit<Store, 'id'> = {
            name: `${user.name}'s Store`,
            ownerId: user.id,
            address: '',
            contact: '',
            operatingHours: '9:00 AM - 9:00 PM',
          };
          await setDoc(doc(db, 'stores', user.id), newStore);
          setStore({ id: user.id, ...newStore });
        }
      } catch (error) {
        toast.error('Failed to load store data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStore();
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const totalValue = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const lowStockItems = items.filter(item => item.quantity <= item.lowStockThreshold);
  const totalSales = items.reduce((acc, item) => acc + (item.salesCount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.name}!</h1>
          <p className="text-emerald-100">Manage your store and track inventory efficiently.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Items</p>
                <h3 className="text-2xl font-bold text-gray-900">{items.length}</h3>
              </div>
              <Package className="h-10 w-10 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Low Stock Items</p>
                <h3 className="text-2xl font-bold text-red-600">{lowStockItems.length}</h3>
              </div>
              <TrendingUp className="h-10 w-10 text-red-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Value</p>
                <h3 className="text-2xl font-bold text-emerald-600">
                  ${totalValue.toFixed(2)}
                </h3>
              </div>
              <DollarSign className="h-10 w-10 text-emerald-600" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Sales</p>
                <h3 className="text-2xl font-bold text-blue-600">{totalSales}</h3>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-600" />
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Inventory Management</h2>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Item
                </button>
              </div>
              <InventoryTable
                items={items}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>

            {store && <SalesChart storeId={store.id} />}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {store && <StoreProfile store={store} onUpdate={() => {}} />}
          </div>
        </div>
      </div>

      {showAddModal && store && (
        <InventoryForm
          storeId={store.id}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

export default StoreOwnerDashboard;