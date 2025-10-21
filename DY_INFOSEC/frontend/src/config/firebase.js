import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCdIWGNBu86vyXPmq0fJNT9sG8YsoUyUEM",
  authDomain: "dy-infosec.firebaseapp.com",
  projectId: "dy-infosec",
  storageBucket: "dy-infosec.firebasestorage.app",
  messagingSenderId: "532308371569",
  appId: "1:532308371569:web:bc96ea9202f3f0ba0453d0",
  measurementId: "G-D6QVEKQKXV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
