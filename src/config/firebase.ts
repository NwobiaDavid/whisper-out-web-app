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
  apiKey: "AIzaSyBzJMDkfQ48ystEsA00S0jnOiPgg3uIKg8",
  authDomain: "whisper-out.firebaseapp.com",
  projectId: "whisper-out",
  storageBucket: "whisper-out.appspot.com",
  messagingSenderId: "293803792725",
  appId: "1:293803792725:web:9551d9f5c70dfc6f9e77dc",
  measurementId: "G-4E41LSP0KQ"
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