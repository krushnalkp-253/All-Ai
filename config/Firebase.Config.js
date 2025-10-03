// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "netflixgpt-72737-7312f.firebaseapp.com",
  projectId: "netflixgpt-72737-7312f",
  storageBucket: "netflixgpt-72737-7312f.firebasestorage.app",
  messagingSenderId: "916552118748",
  appId: "1:916552118748:web:7bb97ae8e953389a16df19",
  measurementId: "G-7CRZL35321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app,'(default)');