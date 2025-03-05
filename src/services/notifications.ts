import { collection, addDoc, onSnapshot, query, where, orderBy, updateDoc, doc, getDocs, DocumentReference, DocumentData } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { Notification } from '../types/notification';

export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt.toDate()
  })) as Notification[];
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate()
    })) as Notification[];
    callback(notifications);
  });
};

export const markAsRead = async (notificationId: string) => {
  await updateDoc(doc(db, 'notifications', notificationId), {
    read: true
  });
};

export const createNotification = async (notification: {
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'price';
}): Promise<DocumentReference<DocumentData>> => {
  return addDoc(collection(db, 'notifications'), {
    ...notification,
    read: false,
    createdAt: new Date()
  });
};