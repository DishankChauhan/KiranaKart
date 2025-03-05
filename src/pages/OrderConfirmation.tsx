import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Order } from '../types/order';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order);
          toast.success('Order placed successfully!');
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center mb-8">
            <CheckCircle className="h-16 w-16 text-emerald-600 mr-4" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Confirmed!</h1>
              <p className="text-gray-600">Order ID: #{orderId}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-emerald-600 mr-2" />
                <span className="font-medium">Order Status</span>
              </div>
              <span className="text-emerald-600 font-medium capitalize">{order.status}</span>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-emerald-600">{formatCurrency(order.total)}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                View All Orders
              </button>
              <button
                onClick={() => navigate('/browse')}
                className="px-6 py-2 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;