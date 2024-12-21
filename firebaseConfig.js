import { initializeApp } from "firebase/app"; // Firebase SDK
import { getDatabase } from "firebase/database"; // Firebase Realtime Database SDK

// Your Firebase config here
const firebaseConfig = {
  apiKey: "AIzaSyB2owlYxUu7viTnJ_LiVwjCkgL0BSDbxv0",
  authDomain: "splito-2e33f.firebaseapp.com",
  databaseURL: "https://splito-2e33f-default-rtdb.firebaseio.com",
  projectId: "splito-2e33f",
  storageBucket: "splito-2e33f.appspot.com",
  messagingSenderId: "1073721283091",
  appId: "1:1073721283091:android:1c0ef416f6ea17b23325e6",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Initialize Firebase Database

export default database;
