import { collection, addDoc, updateDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { CartItem } from '../types/cart';
import { Order } from '../types/order';
import { createNotification } from './notifications';

export const createOrder = async (
  userId: string,
  storeId: string,
  items: CartItem[],
  total: number
): Promise<string> => {
  // Create the order
  const order: Omit<Order, 'id'> = {
    userId,
    storeId,
    items,
    total,
    status: 'pending',
    createdAt: new Date(),
  };

  const orderRef = await addDoc(collection(db, 'orders'), order);
  
  // Update inventory quantities
  for (const item of items) {
    const itemRef = doc(db, 'inventory', item.id);
    const itemDoc = await getDoc(itemRef);
    if (itemDoc.exists()) {
      const currentQuantity = itemDoc.data().quantity;
      await updateDoc(itemRef, {
        quantity: currentQuantity - item.quantity,
        salesCount: (itemDoc.data().salesCount || 0) + item.quantity
      });
    }
  }

  // Create a sales record
  await addDoc(collection(db, 'sales'), {
    orderId: orderRef.id,
    storeId,
    items,
    totalAmount: total,
    quantity: items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0),
    date: new Date(),
  });

  // Send notification to store owner
  await createNotification({
    userId: storeId,
    title: 'New Order',
    message: `New order #${orderRef.id.slice(0, 8)} received`,
    type: 'order'
  });

  return orderRef.id;
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, { status });
};

export const verifyPayment = async (orderId: string, paymentId: string) => {
  const orderRef = doc(db, 'orders', orderId);
  await updateDoc(orderRef, {
    status: 'processing',
    paymentId,
    paymentVerified: true,
    paymentDate: new Date()
  });
};