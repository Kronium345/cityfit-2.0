import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAVd9ylNiY7NftzcMRzXfNG0s4MYV_A6Bg",
  authDomain: "cityfit2.firebaseapp.com",
  projectId: "cityfit2",
  storageBucket: "cityfit2.appspot.com",
  messagingSenderId: "264464118783",
  appId: "1:264464118783:web:9f7a2cca61bedfda062dca"
};

const app = initializeApp(firebaseConfig);

// Use initializeAuth instead of getAuth for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const db = getFirestore(app);

export { auth, db };
