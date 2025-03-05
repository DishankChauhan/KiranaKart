import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign } from 'lucide-react';
import { processPayment } from '../../services/payment';
import { toast } from 'react-hot-toast';

interface PaymentFormProps {
  orderId: string;
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  orderId,
  amount,
  onSuccess,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const result = await processPayment({
        orderId,
        amount,
        currency: 'USD',
        method: paymentMethod,
        status: 'pending',
      });

      if (result.success) {
        toast.success('Payment processed successfully');
        onSuccess();
      } else {
        toast.error('Payment failed');
      }
    } catch (error) {
      toast.error('Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
        
        <div className="mb-6">
          <p className="text-lg">
            Total Amount: <span className="font-bold">${amount.toFixed(2)}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block">
              <input
                type="radio"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="mr-2"
              />
              <CreditCard className="inline-block w-5 h-5 mr-2" />
              Credit/Debit Card
            </label>

            <label className="block">
              <input
                type="radio"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="mr-2"
              />
              <DollarSign className="inline-block w-5 h-5 mr-2" />
              Cash on Delivery
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PaymentForm;