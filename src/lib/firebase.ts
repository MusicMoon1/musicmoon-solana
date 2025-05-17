import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAhdAfEyEgDUfBm4c1h6TLTyzjDS_3OpQ0",
    authDomain: "musicmoon-3d1b5.firebaseapp.com",
    projectId: "musicmoon-3d1b5",
    storageBucket: "musicmoon-3d1b5.firebasestorage.app",
    messagingSenderId: "718660394212",
    appId: "1:718660394212:web:dba9ffc8954bc1da9ae0f1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app); 