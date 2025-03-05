import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types/cart';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              total: state.total + item.price * item.quantity,
            };
          }
          return {
            items: [...state.items, item],
            total: state.total + item.price * item.quantity,
          };
        });
      },

      removeItem: (itemId) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          return {
            items: state.items.filter((i) => i.id !== itemId),
            total: state.total - (item ? item.price * item.quantity : 0),
          };
        });
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          const item = state.items.find((i) => i.id === itemId);
          if (!item) return state;
          
          const oldTotal = item.price * item.quantity;
          const newTotal = item.price * quantity;
          
          if (quantity === 0) {
            return {
              items: state.items.filter((i) => i.id !== itemId),
              total: state.total - oldTotal,
            };
          }

          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
            total: state.total - oldTotal + newTotal,
          };
        });
      },

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage',
      skipHydration: false,
    }
  )
);