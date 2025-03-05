import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ChevronLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { formatCurrency } from '../utils/formatters';
import { createOrder } from '../services/orders';
import { useAuthStore } from '../store/authStore';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      return;
    }

    try {
      if (items.length === 0) {
        toast.error('Your cart is empty');
        return;
      }

      // Create order in your system
      const orderRef = await createOrder(user.id, items[0].storeId, items, total);
      
      // Redirect to Razorpay payment page
      window.location.href = 'https://pages.razorpay.com/pl_Ps9vL1wzCeP2K9/view';

      // Clear cart after successful order creation
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Checkout failed. Please try again.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4">
        <div className="max-w-3xl mx-auto text-center py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to your cart to continue shopping</p>
            <button
              onClick={() => navigate('/browse')}
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={() => navigate('/browse')}
            className="text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {items.map((item) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center py-6 border-b last:border-0"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div className="flex-1 ml-4">
                <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                <p className="text-emerald-600 font-medium">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="flex items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  -
                </motion.button>
                <span className="mx-4">{item.quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  +
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeItem(item.id)}
                  className="ml-6 text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-5 w-5" />
                </motion.button>
              </div>
            </motion.div>
          ))}

          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckout}
              className="w-full mt-6 py-3 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center"
            >
              <span>Proceed to Checkout</span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;