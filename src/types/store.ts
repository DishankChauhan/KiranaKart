export interface StoreRating {
  id: string;
  storeId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}