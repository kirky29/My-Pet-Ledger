// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbiJPaMIv6uVqfjmR00MsrwciVkRc3JQg",
  authDomain: "my-pet-ledger.firebaseapp.com",
  projectId: "my-pet-ledger",
  storageBucket: "my-pet-ledger.firebasestorage.app",
  messagingSenderId: "658885577617",
  appId: "1:658885577617:web:2eb0dc7af0292bb6182830"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

export default app; 