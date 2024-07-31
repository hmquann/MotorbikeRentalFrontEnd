import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCMq8EkSpkRRNuhpL4GAGamAqcmyJuNdTw",
  authDomain: "motorrentalservice-e6ea5.firebaseapp.com",
  projectId: "motorrentalservice-e6ea5",
  storageBucket: "motorrentalservice-e6ea5.appspot.com",
  messagingSenderId: "851445475825",
  appId: "1:851445475825:web:1ed1b0057d1dc3d4b23c50",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
