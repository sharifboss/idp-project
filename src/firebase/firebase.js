import { initializeApp } from "firebase/app";
import { 
  onAuthStateChanged,
  setPersistence, 
  browserLocalPersistence,
  signOut // <-- Add this import
} from "firebase/auth";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyC_A4t2w7qmya2n3Gc26GBZePeolBjOTDw",
  authDomain: "bookshop-c30a2.firebaseapp.com",
  projectId: "bookshop-c30a2",
  storageBucket: "bookshop-c30a2.firebasestorage.app",
  messagingSenderId: "990505462425",
  appId: "1:990505462425:web:12b47cc76166e635c4e608",
  measurementId: "G-37MBGE3V71"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app); 

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase session persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});

export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);

// Export the signOut function
export { 
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  onAuthStateChanged,
  storage,
  signOut // <-- Export signOut here
};
