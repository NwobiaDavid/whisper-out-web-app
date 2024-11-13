// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth, onAuthStateChanged, User } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxMzzznYhLLAD9-pmCOYh92Z4Z-5_FEHU",
  authDomain: "whisperout-68546.firebaseapp.com",
  projectId: "whisperout-68546",
  storageBucket: "whisperout-68546.firebasestorage.app",
  messagingSenderId: "140150980931",
  appId: "1:140150980931:web:11e83555a2c092be52eff6",
  measurementId: "G-8WSH4GGYP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);


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