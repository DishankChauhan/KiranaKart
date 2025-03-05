import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderTrackingProps {
  orderId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  updates: {
    status: string;
    timestamp: Date;
    message: string;
  }[];
}

const OrderTracking: React.FC<OrderTrackingProps> = ({ orderId, status, updates }) => {
  const steps = [
    { key: 'pending', icon: Package, label: 'Order Placed' },
    { key: 'processing', icon: Clock, label: 'Processing' },
    { key: 'shipped', icon: Truck, label: 'Out for Delivery' },
    { key: 'delivered', icon: CheckCircle, label: 'Delivered' }
  ];

  const currentStep = steps.findIndex(step => step.key === status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-6">Order Status #{orderId}</h2>
      
      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="flex justify-between mb-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.key}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'text-emerald-600' : 'text-gray-400'
                }`}
              >
                <div className="relative">
                  <Icon className="h-8 w-8" />
                  {index < currentStep && (
                    <motion.div
                      className="absolute inset-0 bg-emerald-600 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </div>
                <span className="mt-2 text-sm">{step.label}</span>
              </div>
            );
          })}
        </div>
        
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
          <motion.div
            className="h-full bg-emerald-600"
            initial={{ width: '0%' }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Status Updates */}
      <div className="space-y-4">
        {updates.map((update, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start space-x-4"
          >
            <div className="w-2 h-2 mt-2 rounded-full bg-emerald-600" />
            <div>
              <p className="font-medium">{update.status}</p>
              <p className="text-sm text-gray-500">
                {update.timestamp.toLocaleDateString()} {update.timestamp.toLocaleTimeString()}
              </p>
              <p className="text-sm">{update.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;