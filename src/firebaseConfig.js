// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApdE5IFwlvHSj0td7s31A1dGy4dZocwbs",
  authDomain: "blogapp-6c741.firebaseapp.com",
  databaseURL: "https://blogapp-6c741-default-rtdb.firebaseio.com",
  projectId: "blogapp-6c741",
  storageBucket: "blogapp-6c741.firebasestorage.app",
  messagingSenderId: "762794664823",
  appId: "1:762794664823:web:b6aedc646896e0e79ff772"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { app, auth, db };
