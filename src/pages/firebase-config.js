// src/firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  // Your Firebase config object
  apiKey: "AIzaSyBSx8CESxZMe1CaCIZ4AGD-kYhurP_2ZA0",
  authDomain: "aibnb-3c717.firebaseapp.com",
  projectId: "aibnb-3c717",
  storageBucket: "aibnb-3c717.appspot.com",
  messagingSenderId: "892151510919",
  appId: "1:892151510919:web:f236a5bc756091f4f8c522"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
