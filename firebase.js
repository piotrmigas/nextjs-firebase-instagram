import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjfM5lXm9rbiuZE3Cgy6OXx0s6MZbAqNc",
  authDomain: "nextjs-instagram.firebaseapp.com",
  projectId: "nextjs-instagram",
  storageBucket: "nextjs-instagram.appspot.com",
  messagingSenderId: "17434496235",
  appId: "1:17434496235:web:3729719cffc4767f0bc2ae",
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore();
export const storage = getStorage();
