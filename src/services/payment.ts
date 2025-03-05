import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  method: 'card' | 'cash' | 'upi';
  status: 'pending' | 'completed' | 'failed';
}

// Production Razorpay configuration
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = import.meta.env.VITE_RAZORPAY_KEY_SECRET;

export const processPayment = async (paymentDetails: PaymentDetails): Promise<{ success: boolean; redirectUrl?: string }> => {
  try {
    // Create payment record
    const paymentRef = await addDoc(collection(db, 'payments'), {
      ...paymentDetails,
      timestamp: new Date()
    });

    // Update order status
    await updateDoc(doc(db, 'orders', paymentDetails.orderId), {
      status: 'processing',
      paymentId: paymentRef.id
    });

    // Initialize Razorpay payment
    const options = {
      key: RAZORPAY_KEY_ID,
      amount: Math.round(paymentDetails.amount * 100), // Convert to paise
      currency: "INR",
      name: "KiranaKart",
      description: `Order #${paymentDetails.orderId}`,
      order_id: paymentDetails.orderId,
      handler: function (response: any) {
        verifyPayment(response.razorpay_payment_id, paymentDetails.orderId);
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#059669"
      }
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();

    return { success: true };
  } catch (error) {
    console.error('Payment processing error:', error);
    return { success: false };
  }
};

export const verifyPayment = async (paymentId: string, orderId: string): Promise<boolean> => {
  try {
    const paymentRef = doc(db, 'payments', paymentId);
    await updateDoc(paymentRef, {
      status: 'completed',
      verifiedAt: new Date()
    });

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: 'confirmed',
      paymentVerifiedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};