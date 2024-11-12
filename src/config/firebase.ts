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
  apiKey: "AIzaSyBBxPdddBT3WVl4ONQwTHyIzv-FrGJXcoA",
  authDomain: "whisperout-bf676.firebaseapp.com",
  projectId: "whisperout-bf676",
  storageBucket: "whisperout-bf676.appspot.com",
  messagingSenderId: "553218409433",
  appId: "1:553218409433:web:f288ace9d3d1ac21934fc8",
  measurementId: "G-QE43K7LZ82"
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