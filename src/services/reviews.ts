import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

import type { Review } from '../types/review';

export const createReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
  return addDoc(collection(db, 'reviews'), {
    ...review,
    createdAt: new Date()
  });
};

export const addReview = async (review: Review) => {
  try {
    const reviewRef = await addDoc(collection(db, 'reviews'), review);
    return reviewRef.id; // Return the ID of the newly created review
  } catch (error) {
    throw new Error('Failed to add review');
  }
};

export const getProductReviews = async (productId: string): Promise<Review[]> => {
  const q = query(
    collection(db, 'reviews'),
    where('productId', '==', productId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Review[];
};