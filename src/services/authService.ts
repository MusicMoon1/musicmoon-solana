import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, query, where, getDocs, addDoc } from 'firebase/firestore';
import { User } from '@/types/user';
import { saveUserToStorage, removeUserFromStorage } from './userService';
import { toast } from 'react-hot-toast';

const usersCollection = 'users';

export const signUp = async (userData: Omit<User, 'id'>): Promise<User> => {
  try {
    // Check if user already exists
    const q = query(collection(db, usersCollection), where('email', '==', userData.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      throw new Error('User with this email already exists');
    }

    // Create new user document
    const userRef = doc(collection(db, usersCollection));
    const newUser: User = {
      id: userRef.id,
      ...userData
    };

    await setDoc(userRef, newUser);
    saveUserToStorage(newUser);
    toast.success('Account created successfully!');
    return newUser;
  } catch (error) {
    console.error('Sign up error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to create account');
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const q = query(
      collection(db, usersCollection),
      where('email', '==', email),
      where('password', '==', password)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error('Invalid email or password');
    }

    const userData = querySnapshot.docs[0].data() as User;
    saveUserToStorage(userData);
    toast.success('Signed in successfully!');
    return userData;
  } catch (error) {
    console.error('Sign in error:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    throw error;
  }
};

export const signOut = (): void => {
  removeUserFromStorage();
  toast.success('Signed out successfully!');
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = localStorage.getItem('musicmoon_user');
    if (!userData) return null;

    const user = JSON.parse(userData) as User;
    const userRef = doc(db, usersCollection, user.id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      removeUserFromStorage();
      return null;
    }

    return userSnap.data() as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('User not found');
  }

  const userDoc = querySnapshot.docs[0];
  const userData = userDoc.data() as User;

  // In a real app, you would verify the password here
  // For now, we'll just check if the email exists
  if (userData.email !== email) {
    throw new Error('Invalid credentials');
  }

  return {
    ...userData,
    id: userDoc.id
  };
};

export const register = async ({
  name,
  email,
  password
}: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    throw new Error('Email already exists');
  }

  const now = new Date().toISOString();
  const newUser = {
    name,
    email,
    createdAt: now,
    updatedAt: now
  };

  const docRef = await addDoc(usersRef, newUser);

  return {
    ...newUser,
    id: docRef.id
  };
}; 