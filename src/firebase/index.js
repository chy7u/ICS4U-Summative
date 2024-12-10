import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Paste your firebaseConfig from Firebase Console here
const firebaseConfig = {
    apiKey: "AIzaSyCeUeV8WYFkU_VSE0faSnOgzs1tc4cj5Cw",
    authDomain: "summative-11703.firebaseapp.com",
    projectId: "summative-11703",
    storageBucket: "summative-11703.firebasestorage.app",
    messagingSenderId: "50015309084",
    appId: "1:50015309084:web:ea0de1bec1f7a38e28fed9"
  };

const config = initializeApp(firebaseConfig)
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };