
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const {
  VITE_REACT_FIREBASE_APP_API_KEY,
  VITE_REACT_FIREBASE_APP_AUTH_DOMAIN,
  VITE_REACT_FIREBASE_APP_PROJECT_ID,
  VITE_REACT_FIREBASE_APP_STORAGE_BUCCKET,
  VITE_REACT_FIREBASE_APP_MESSAGING_SENDER_ID,
  VITE_REACT_FIREBASE_APP_MESSAGING_APPLE_ID,
  VITE_REACT_FIREBASE_APP_MESSAGING_MEASUREMENT_ID,
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_REACT_FIREBASE_APP_API_KEY,
  authDomain: VITE_REACT_FIREBASE_APP_AUTH_DOMAIN,
  projectId: VITE_REACT_FIREBASE_APP_PROJECT_ID,
  storageBucket: VITE_REACT_FIREBASE_APP_STORAGE_BUCCKET,
  messagingSenderId: VITE_REACT_FIREBASE_APP_MESSAGING_SENDER_ID,
  appId: VITE_REACT_FIREBASE_APP_MESSAGING_APPLE_ID,
  measurementId: VITE_REACT_FIREBASE_APP_MESSAGING_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);