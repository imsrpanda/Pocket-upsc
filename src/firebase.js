import { initializeApp } from "firebase/app";
import { 
  initializeAuth, 
  indexedDBLocalPersistence, 
  browserLocalPersistence, 
  browserPopupRedirectResolver, // <-- Add this import
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYHtGdt6fCRKRlFC1CRSKBOYaMeTEml3A",
  authDomain: "pocket-upsc.firebaseapp.com",
  projectId: "pocket-upsc",
  storageBucket: "pocket-upsc.firebasestorage.app",
  messagingSenderId: "444455458285",
  appId: "1:444455458285:web:35ff30d680a6bb041343e4"
};

const app = initializeApp(firebaseConfig);

// Provide both local storage persistence and the browser popup resolver
export const auth = initializeAuth(app, {
  persistence: [indexedDBLocalPersistence, browserLocalPersistence],
  popupRedirectResolver: browserPopupRedirectResolver, // <-- Add this resolver
});

export const dbFirestore = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, signOut, doc, getDoc };