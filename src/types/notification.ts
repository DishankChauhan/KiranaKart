export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'price';
  read: boolean;
  createdAt: Date;
}