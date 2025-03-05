import { create } from 'zustand';
import { 
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import type { GroceryItem } from '../types/inventory';

interface InventoryState {
  items: GroceryItem[];
  isLoading: boolean;
  error: string | null;
}

interface InventoryStore extends InventoryState {
  addItem: (item: Omit<GroceryItem, 'id'>) => Promise<void>;
  updateItem: (id: string, item: Partial<GroceryItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  loadStoreItems: (storeId: string) => void;
}

export const useInventoryStore = create<InventoryStore>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  addItem: async (item) => {
    try {
      set({ isLoading: true, error: null });
      await addDoc(collection(db, 'inventory'), item);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateItem: async (id, item) => {
    try {
      set({ isLoading: true, error: null });
      await updateDoc(doc(db, 'inventory', id), item);
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  deleteItem: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await deleteDoc(doc(db, 'inventory', id));
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  loadStoreItems: (storeId) => {
    const q = query(collection(db, 'inventory'), where('storeId', '==', storeId));
    
    onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as GroceryItem[];
      
      set({ items, isLoading: false });
    }, (error) => {
      set({ error: error.message, isLoading: false });
    });
  }
}));