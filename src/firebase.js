// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcW35xNyXe1xelpItsNgYfpDpFyQIzxKU",
  authDomain: "e-izin-uts.firebaseapp.com",
  projectId: "e-izin-uts",
  storageBucket: "e-izin-uts.firebasestorage.app",
  messagingSenderId: "1021098151488",
  appId: "1:1021098151488:web:1255fc08c41e9f0ce259a5",
  measurementId: "G-4PGW6LD85T"
};


// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);