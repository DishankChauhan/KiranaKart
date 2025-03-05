import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { StoreRating } from '../types/store';

export const addStoreRating = async (rating: Omit<StoreRating, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'storeRatings'), {
    ...rating,
    createdAt: new Date()
  });
};

export const getStoreRatings = async (storeId: string): Promise<StoreRating[]> => {
  const q = query(
    collection(db, 'storeRatings'),
    where('storeId', '==', storeId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as StoreRating[];
};

export const getAverageRating = async (storeId: string): Promise<number> => {
  const ratings = await getStoreRatings(storeId);
  if (ratings.length === 0) return 0;
  
  const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return sum / ratings.length;
};