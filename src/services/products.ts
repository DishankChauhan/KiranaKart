import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { GroceryItem } from '../types/inventory';

export const searchProducts = async (
  storeId: string,
  searchParams: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }
) => {
  let q = query(collection(db, 'inventory'), where('storeId', '==', storeId));

  const snapshot = await getDocs(q);
  let products = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as GroceryItem[];

  // Apply filters
  if (searchParams.query) {
    const searchLower = searchParams.query.toLowerCase();
    products = products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    );
  }

  if (searchParams.category && searchParams.category !== 'all') {
    products = products.filter(product => product.category === searchParams.category);
  }

  if (searchParams.minPrice !== undefined) {
    products = products.filter(product => product.price >= searchParams.minPrice!);
  }

  if (searchParams.maxPrice !== undefined) {
    products = products.filter(product => product.price <= searchParams.maxPrice!);
  }

  if (searchParams.inStock) {
    products = products.filter(product => product.quantity > 0);
  }

  return products;
};