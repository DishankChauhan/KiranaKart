import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import CartItem from './CartItem';
import { createOrder } from '../../services/orders';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-hot-toast';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, storeId }) => {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }

    try {
      await createOrder(user.id, storeId, items, total);
      clearCart();
      toast.success('Order placed successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <ShoppingBag className="h-6 w-6 text-emerald-600 mr-2" />
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
              </div>
              <button onClick={onClose}>
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <ShoppingBag className="h-12 w-12 mb-4" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;