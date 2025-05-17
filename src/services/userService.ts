import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { User } from '@/types/user';

const usersCollection = 'users';
const USER_STORAGE_KEY = 'musicmoon_user';

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const userRef = doc(collection(db, usersCollection));
  const newUser: User = {
    id: userRef.id,
    ...userData,
    createdAt: new Date().toISOString()
  };
  
  await setDoc(userRef, newUser);
  return newUser;
};

export const getUserById = async (userId: string): Promise<User | null> => {
  const userRef = doc(db, usersCollection, userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  return null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, usersCollection), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as User;
  }
  return null;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  const userRef = doc(db, usersCollection, userId);
  await updateDoc(userRef, userData);
};

export const getUserNFTs = async (userId: string): Promise<any[]> => {
  const q = query(collection(db, 'nfts'), where('ownerId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserCreatedNFTs = async (userId: string): Promise<any[]> => {
  const q = query(collection(db, 'nfts'), where('creatorId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const saveUserToStorage = (user: User): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getUserFromStorage = (): User | null => {
  const userData = localStorage.getItem(USER_STORAGE_KEY);
  if (!userData) return null;
  try {
    return JSON.parse(userData) as User;
  } catch (error) {
    console.error('Error parsing user data from storage:', error);
    return null;
  }
};

export const removeUserFromStorage = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const isUserLoggedIn = (): boolean => {
  return getUserFromStorage() !== null;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<Omit<User, 'id' | 'email' | 'createdAt'>>
): Promise<User> => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    throw new Error('User not found');
  }

  const userData = userDoc.data() as User;
  const now = new Date().toISOString();

  await updateDoc(userRef, {
    ...updates,
    updatedAt: now
  });

  return {
    ...userData,
    ...updates,
    updatedAt: now
  };
}; 