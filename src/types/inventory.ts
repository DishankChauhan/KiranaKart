export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  storeId: string;
  lowStockThreshold: number;
  image?: string;
  description?: string;
  barcode?: string;
  lastRestocked?: Date;
  expiryDate?: Date;
  salesCount?: number;
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  address: string;
  contact: string;
  operatingHours: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface SalesRecord {
  id: string;
  storeId: string;
  itemId: string;
  quantity: number;
  totalAmount: number;
  date: Date;
}

export interface StockAlert {
  id: string;
  itemId: string;
  storeId: string;
  type: 'LOW_STOCK' | 'EXPIRING_SOON';
  message: string;
  createdAt: Date;
  isRead: boolean;
}