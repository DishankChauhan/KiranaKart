import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const getSalesData = async (storeId: string) => {
  const salesRef = collection(db, 'sales');
  const q = query(salesRef, where('storeId', '==', storeId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const subscribeSalesData = (storeId: string, callback: (data: any[]) => void) => {
  const salesRef = collection(db, 'sales');
  const q = query(salesRef, where('storeId', '==', storeId));
  
  return onSnapshot(q, (snapshot) => {
    const salesData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(salesData);
  });
};

export const calculateTotalValue = (items: any[]) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const calculateTotalSales = (sales: any[]) => {
  return sales.reduce((total, sale) => total + sale.amount, 0);
};