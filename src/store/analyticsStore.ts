import { create } from 'zustand';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

interface AnalyticsState {
  salesData: any[];
  revenueData: any[];
  topProducts: any[];
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (storeId: string) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  salesData: [],
  revenueData: [],
  topProducts: [],
  isLoading: false,
  error: null,

  fetchAnalytics: async (storeId: string) => {
    try {
      set({ isLoading: true });

      // Fetch sales data
      const salesQuery = query(
        collection(db, 'sales'),
        where('storeId', '==', storeId),
        orderBy('date', 'desc'),
        limit(30)
      );
      const salesSnapshot = await getDocs(salesQuery);
      const salesData = salesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate revenue data
      const revenueData = salesData.reduce((acc: any[], sale: any) => {
        const date = new Date(sale.date.toDate()).toLocaleDateString();
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.revenue += sale.totalAmount;
        } else {
          acc.push({ date, revenue: sale.totalAmount });
        }
        return acc;
      }, []);

      // Fetch top products
      const productsQuery = query(
        collection(db, 'inventory'),
        where('storeId', '==', storeId),
        orderBy('salesCount', 'desc'),
        limit(5)
      );
      const productsSnapshot = await getDocs(productsQuery);
      const topProducts = productsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      set({
        salesData,
        revenueData,
        topProducts,
        isLoading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));