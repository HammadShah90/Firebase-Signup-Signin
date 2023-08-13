import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  orderBy,
  serverTimestamp,
  getDocs,
  onSnapshot,
  deleteDoc,
  query,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDjl9xNBuTP4ehPR4gu1o-ATE7IHvRUsS0",
  authDomain: "fir-signup-signin-95446.firebaseapp.com",
  projectId: "fir-signup-signin-95446",
  storageBucket: "fir-signup-signin-95446.appspot.com",
  messagingSenderId: "405875419025",
  appId: "1:405875419025:web:2d26b81d358c5956eedc30",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  signOut,
  doc,
  onSnapshot,
  onAuthStateChanged,
  deleteDoc,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  query,
  orderBy,
  serverTimestamp,
  auth,
  db,
  where,
  updateDoc,
  arrayRemove,
  arrayUnion,
};
