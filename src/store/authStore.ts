import { create } from 'zustand';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import type { AuthState, User } from '../types/auth';

interface AuthStore extends AuthState {
  signUp: (email: string, password: string, name: string, role: 'store_owner' | 'customer') => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  error: null,

  signUp: async (email, password, name, role) => {
    try {
      set({ isLoading: true, error: null });
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      const userData: User = {
        id: firebaseUser.uid,
        email,
        name,
        role,
        preferences: {}
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      set({ user: userData, isLoading: false });
      return userData;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }
      
      const userData = { ...userDoc.data(), id: firebaseUser.uid } as User;
      set({ user: userData, isLoading: false });
      return userData;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await firebaseSignOut(auth);
      set({ user: null, error: null });
    } catch (error) {
      set({ error: (error as Error).message });
      throw error;
    }
  },

  initialize: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = { ...userDoc.data(), id: firebaseUser.uid } as User;
          set({ user: userData, isLoading: false });
        } else {
          set({ user: null, isLoading: false });
        }
      } else {
        set({ user: null, isLoading: false });
      }
    });
  }
}));