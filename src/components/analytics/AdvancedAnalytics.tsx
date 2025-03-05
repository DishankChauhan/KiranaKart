import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { formatCurrency } from '../../utils/formatters';

interface AdvancedAnalyticsProps {
  storeId: string;
}

const COLORS = ['#059669', '#3B82F6', '#EF4444', '#F59E0B', '#8B5CF6'];

// Define interfaces for the expected data structures
interface SalesData {
  date: string;
  totalAmount: number; // Add other properties as needed
}

interface CategoryData {
  name: string;
  value: number;
}

interface CustomerData {
  id: string;
  total: number;
}

// Define the type for the accumulator
interface CategoryAccumulator {
  [key: string]: number; // String keys with number values
}

// Define the type for the customer accumulator
interface CustomerAccumulator {
  [key: string]: number; // String keys with number values
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ storeId }) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]); // Specify type
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]); // Specify type
  const [customerData, setCustomerData] = useState<CustomerData[]>([]); // Specify type

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch sales data
        const salesQuery = query(
          collection(db, 'sales'),
          where('storeId', '==', storeId),
          orderBy('date', 'desc')
        );
        const salesSnapshot = await getDocs(salesQuery);
        const sales = salesSnapshot.docs.map(doc => ({
          date: new Date(doc.data().date.toDate()).toLocaleDateString(),
          totalAmount: doc.data().totalAmount // Ensure this matches your data structure
        }));
        setSalesData(sales);

        // Fetch category distribution
        const inventoryQuery = query(
          collection(db, 'inventory'),
          where('storeId', '==', storeId)
        );
        const inventorySnapshot = await getDocs(inventoryQuery);
        const categories = inventorySnapshot.docs.reduce<CategoryAccumulator>((acc, doc) => {
          const category = doc.data().category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        setCategoryData(
          Object.entries(categories).map(([name, value]) => ({
            name,
            value
          }))
        );

        // Fetch customer data
        const ordersQuery = query(
          collection(db, 'orders'),
          where('storeId', '==', storeId)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const customers = ordersSnapshot.docs.reduce<CustomerAccumulator>((acc, doc) => {
          const userId = doc.data().userId;
          acc[userId] = (acc[userId] || 0) + doc.data().total;
          return acc;
        }, {});
        setCustomerData(
          Object.entries(customers).map(([id, total]) => ({
            id,
            total
          }))
        );
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, [storeId]);

  return (
    <div className="space-y-8">
      {/* Revenue Trend */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              <Area
                type="monotone"
                dataKey="totalAmount"
                stroke="#059669"
                fill="#059669"
                fillOpacity={0.2}
                name="Revenue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Spending */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Customer Spending</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={customerData.slice(0, 5)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="total" fill="#3B82F6" name="Total Spent" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;