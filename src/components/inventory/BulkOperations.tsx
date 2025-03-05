import React, { useState } from 'react';
import { Upload, Download, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Papa from 'papaparse';
import { motion } from 'framer-motion';
import { bulkImport, bulkExport } from '../../services/inventory';

interface BulkOperationsProps {
  storeId: string;
  onComplete: () => void;
}

const BulkOperations: React.FC<BulkOperationsProps> = ({ storeId, onComplete }) => {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = [
      'csv', 'xlsx', 'xls', 'json', 'txt'
    ];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file format. Please upload a CSV, Excel, JSON, or TXT file.');
      return;
    }

    setImporting(true);
    setProgress(0);

    try {
      await bulkImport(file, storeId);
      toast.success('Import completed successfully');
      onComplete();
    } catch (error) {
      toast.error('Failed to import inventory');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      await bulkExport(storeId);
      toast.success('Export completed successfully');
    } catch (error) {
      toast.error('Failed to export inventory');
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        name: 'Example Item',
        category: 'general',
        price: 9.99,
        quantity: 100,
        lowStockThreshold: 10,
        description: 'Example description',
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Operations</h3>

        <div className="space-y-4">
          <div>
            <button
              onClick={downloadTemplate}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Template
            </button>
          </div>

          <div>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json,.txt"
              onChange={handleImport}
              className="hidden"
              id="bulk-import"
              disabled={importing}
            />
            <label
              htmlFor="bulk-import"
              className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium ${
                importing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <Upload className="h-5 w-5 mr-2" />
              {importing ? 'Importing...' : 'Import Inventory'}
            </label>

            {importing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2"
              >
                <div className="h-2 bg-gray-200 rounded-full">
                  <motion.div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Current Inventory
          </button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Import Guidelines</h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Supported formats: CSV, Excel, JSON, TXT</li>
                  <li>Maximum file size: 10MB</li>
                  <li>Required columns: name, category, price, quantity</li>
                  <li>Optional: description, lowStockThreshold</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;