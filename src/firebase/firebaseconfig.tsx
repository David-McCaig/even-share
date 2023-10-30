
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCzKpSc68iGDFaGNP0VIvhYGab48loEkd4',
  authDomain: 'split-bill-427e2.firebaseapp.com',
  projectId: 'split-bill-427e2',
  storageBucket: 'split-bill-427e2.appspot.com',
  messagingSenderId: '98401231170',
  appId: '1:98401231170:web:61f1eed1898e81f42768db',
  measurementId: 'G-27Q3NY7SXE',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

