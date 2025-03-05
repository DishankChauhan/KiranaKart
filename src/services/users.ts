import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types/auth';

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
};