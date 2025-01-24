// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth, onAuthStateChanged, User } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1g8IGuc4TavZSV5YzJRobQM78tApIcSU",
  authDomain: "whisperout-710a8.firebaseapp.com",
  projectId: "whisperout-710a8",
  storageBucket: "whisperout-710a8.firebasestorage.app",
  messagingSenderId: "1015375025230",
  appId: "1:1015375025230:web:e7fdf3b40c7dd3197e1f1f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

type SetUser = (user: User | null) => void;
type SetLoading = (loading: boolean) => void;

export const checkAuthStatus = (setUser: SetUser, setLoading: SetLoading): void => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user); 
    } else {
      setUser(null); 
    }
    setLoading(false); 
  });
};