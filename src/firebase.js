import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const app = initializeApp({
  apiKey: "AIzaSyCbQeasxogP7csbysyO5KtVN2iUfGu9EoY",
  authDomain: "friend-club-c81da.firebaseapp.com",
  projectId: "friend-club-c81da",
  storageBucket: "friend-club-c81da.appspot.com",
  messagingSenderId: "288587670797",
  appId: "1:288587670797:web:677cc4d67942e08db37c44",
  measurementId: "G-G7VRJ89Z64",
});

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
