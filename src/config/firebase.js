// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDtQ8ihDppLRbZLE-VCvBohsvQc2w_p4Ao",
  authDomain: "portfolio-munjogu.firebaseapp.com",
  projectId: "portfolio-munjogu",
  storageBucket: "portfolio-munjogu.firebasestorage.app",
  messagingSenderId: "796392553059",
  appId: "1:796392553059:web:8aa94fa7746785d0d35656",
  measurementId: "G-HXRTXMS7F4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;