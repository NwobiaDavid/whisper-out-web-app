// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth, onAuthStateChanged } from "firebase/auth"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIRE_API_KEY,
  authDomain: "whisper-out.firebaseapp.com",
  projectId: "whisper-out",
  storageBucket: import.meta.env.VITE_STORAGE_BUK,
  messagingSenderId: import.meta.env.VITE_MESSAGE_ID,
  appId: import.meta.env.VITE_FIRE_APP_ID,
  measurementId: import.meta.env.VITE_MEASURE_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);


export const checkAuthStatus = (setUser, setLoading) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUser(user); // Set the authenticated user
    } else {
      setUser(null); // Set to null if the user is not authenticated
    }
    setLoading(false); // Indicate loading is complete
  });
};