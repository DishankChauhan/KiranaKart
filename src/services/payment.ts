import { doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface PaymentDetails {
  orderId: string;
  amount: number;
  currency: string;
  method: 'card' | 'cash' | 'upi';
  status: 'pending' | 'completed' | 'failed';
}

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

    // Return Razorpay URL with parameters
    const razorpayUrl = 'https://rzp.io/rzp/bh9CNEVH';
    const params = new URLSearchParams({
      amount: Math.round(paymentDetails.amount * 100).toString(),
      order_id: paymentDetails.orderId,
      payment_id: paymentRef.id,
    });

    return { 
      success: true,
      redirectUrl: `${razorpayUrl}?${params.toString()}`
    };
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