import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  return uploadImage(file, `profiles/${userId}/${Date.now()}_${file.name}`);
};

export const uploadProductImage = async (file: File, storeId: string): Promise<string> => {
  return uploadImage(file, `products/${storeId}/${Date.now()}_${file.name}`);
};