import { create } from 'zustand';
import { collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

interface WishlistStore {
  items: string[];
  isLoading: boolean;
  error: string | null;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loadWishlist: (userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  addToWishlist: async (productId) => {
    try {
      set({ isLoading: true });
      await addDoc(collection(db, 'wishlist'), {
        userId: 'current-user-id', // Replace with actual user ID
        productId,
        createdAt: new Date()
      });
      set((state) => ({
        items: [...state.items, productId],
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      set({ isLoading: true });
      const q = query(
        collection(db, 'wishlist'),
        where('userId', '==', 'current-user-id'),
        where('productId', '==', productId)
      );
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
      set((state) => ({
        items: state.items.filter((id) => id !== productId),
        isLoading: false
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  isInWishlist: (productId) => {
    return get().items.includes(productId);
  },

  loadWishlist: async (userId) => {
    try {
      set({ isLoading: true });
      const q = query(
        collection(db, 'wishlist'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      const wishlistItems = snapshot.docs.map((doc) => doc.data().productId);
      set({ items: wishlistItems, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  }
}));