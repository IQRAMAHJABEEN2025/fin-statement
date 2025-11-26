
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDhzUd9U78xuysUKvSYNUxR0trHzJXKu-E",
  authDomain: "fyp-authentication-d1445.firebaseapp.com",
  projectId: "fyp-authentication-d1445",
  storageBucket: "fyp-authentication-d1445.firebasestorage.app",
  messagingSenderId: "811012610063",
  appId: "1:811012610063:web:93432d4109521194ac6b7a",
  measurementId: "G-T5FK0WK4HC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getDatabase(app);
