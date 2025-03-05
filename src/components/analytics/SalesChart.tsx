import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { formatCurrency } from '../../utils/formatters';
import { format } from 'date-fns';

interface SalesChartProps {
  storeId: string;
}

const SalesChart: React.FC<SalesChartProps> = ({ storeId }) => {
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    const fetchSalesData = async () => {
      const q = query(
        collection(db, 'sales'),
        where('storeId', '==', storeId),
        orderBy('date', 'desc')
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        ...doc.data(),
        date: format(doc.data().date.toDate(), 'MMM dd')
      }));
      setSalesData(data);
    };

    fetchSalesData();
  }, [storeId]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Sales Analytics</h2>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              yAxisId="left"
              tickFormatter={(value) => formatCurrency(value)}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right"
              tickFormatter={(value) => `${value} items`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === 'Total Sales') return formatCurrency(value);
                return `${value} items`;
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalAmount"
              stroke="#059669"
              name="Total Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="quantity"
              stroke="#2563eb"
              name="Items Sold"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesChart;