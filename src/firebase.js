import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBdROBLVLL7TPfgwiKFzZrcpZdS04SwQuw",
  authDomain: "mimotor-bce94.firebaseapp.com",
  projectId: "mimotor-bce94",
  storageBucket: "mimotor-bce94.appspot.com",
  messagingSenderId: "480806774206",
  appId: "1:480806774206:web:909490716a72474c1945ef"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
