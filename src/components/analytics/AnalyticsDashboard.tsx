import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getSalesAnalytics, getPopularItems } from '../../services/analytics';
import { SalesRecord, GroceryItem } from '../../types/inventory';

interface AnalyticsDashboardProps {
  storeId: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ storeId }) => {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [popularItems, setPopularItems] = useState<GroceryItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const sales = await getSalesAnalytics(storeId);
      const popular = await getPopularItems(storeId);
      setSalesData(sales);
      setPopularItems(popular);
    };
    fetchData();
  }, [storeId]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Sales Overview</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalAmount" stroke="#059669" name="Sales" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Popular Items</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={popularItems}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="salesCount" fill="#3b82f6" name="Units Sold" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;