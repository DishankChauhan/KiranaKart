import { CartItem } from './cart';

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}