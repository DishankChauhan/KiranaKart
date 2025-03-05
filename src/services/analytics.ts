import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase';
import { SalesRecord, GroceryItem } from '../types/inventory';

export const getSalesAnalytics = async (storeId: string, days: number = 30) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const q = query(
    collection(db, 'sales'),
    where('storeId', '==', storeId),
    where('date', '>=', startDate),
    where('date', '<=', endDate),
    orderBy('date', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SalesRecord[];
};

export const getPopularItems = async (storeId: string, itemLimit: number = 10) => {
  const q = query(
    collection(db, 'inventory'),
    where('storeId', '==', storeId),
    orderBy('salesCount', 'desc'),
    limit(itemLimit)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as GroceryItem[];
};

export const getLowStockItems = async (storeId: string) => {
  const q = query(
    collection(db, 'inventory'),
    where('storeId', '==', storeId)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }) as GroceryItem)
    .filter(item => item.quantity <= item.lowStockThreshold);
};