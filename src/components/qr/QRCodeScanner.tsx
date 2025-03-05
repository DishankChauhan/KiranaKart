import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { X, Camera } from 'lucide-react';

interface QRCodeScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result) {
      onScan(result?.text);
      onClose();
    }
  };

  const handleError = (err: any) => {
    setError('Failed to access camera');
    toast.error('Failed to access camera');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium">Scan QR Code</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="text-center text-red-600 p-4">{error}</div>
          ) : (
            <QrReader
              onResult={handleScan}
              constraints={{ facingMode: 'environment' }}
              className="w-full"
            />
          )}
        </div>

        <div className="p-4 border-t">
          <p className="text-sm text-gray-500 text-center">
            Position the QR code within the frame to scan
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QRCodeScanner;