import { 
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  increment,
  onSnapshot,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { GroceryItem } from '../types/inventory';
import { createNotification } from './notifications';
import Papa from 'papaparse';

export const updateInventoryQuantity = async (
  itemId: string,
  quantity: number,
  storeId: string,
  lowStockThreshold: number
) => {
  const itemRef = doc(db, 'inventory', itemId);
  
  // Update quantity
  await updateDoc(itemRef, {
    quantity: increment(-quantity)
  });

  // Check if item is now below threshold
  const updatedDoc = await getDoc(doc(db, 'inventory', itemId));
  const currentQuantity = updatedDoc.data()?.quantity;

  if (currentQuantity <= lowStockThreshold) {
    // Create low stock notification
    await createNotification({
      userId: storeId,
      title: 'Low Stock Alert',
      message: `Item ${updatedDoc.data()?.name} is running low on stock (${currentQuantity} remaining)`,
      type: 'stock'
    });
  }
};

export const subscribeToInventoryUpdates = (storeId: string, callback: (items: GroceryItem[]) => void) => {
  const q = query(collection(db, 'inventory'), where('storeId', '==', storeId));
  
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GroceryItem[];
    
    callback(items);
  });
};

export const bulkImport = async (file: File, storeId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const batch = writeBatch(db);
          const inventoryRef = collection(db, 'inventory');

          results.data.forEach((item: any) => {
            const docRef = doc(inventoryRef);
            batch.set(docRef, {
              ...item,
              storeId,
              price: Number(item.price),
              quantity: Number(item.quantity),
              lowStockThreshold: Number(item.lowStockThreshold) || 5
            });
          });

          await batch.commit();
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => reject(error)
    });
  });
};

export const bulkExport = async (storeId: string): Promise<void> => {
  const q = query(collection(db, 'inventory'), where('storeId', '==', storeId));
  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  const csv = Papa.unparse(items);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inventory-${storeId}-${new Date().toISOString()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};