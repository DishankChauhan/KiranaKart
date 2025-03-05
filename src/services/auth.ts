import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from '../types/auth';

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;
    
    // Check if user exists in our database
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create new user document
      const userData: User = {
        id: user.uid,
        email: user.email!,
        name: user.displayName || '',
        role: 'customer', // Default role for Google sign-in
        preferences: {} // Add default preferences (adjust as necessary)
      };
      
      await setDoc(doc(db, 'users', user.uid), userData);
      return userData;
    }
    
    return userDoc.data() as User;
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw error;
  }
};

export const verifyEmail = async (user: FirebaseUser) => {
  try {
    await sendEmailVerification(user);
  } catch (error) {
    throw error;
  }
};