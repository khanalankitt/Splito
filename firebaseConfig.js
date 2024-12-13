import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2owlYxUu7viTnJ_LiVwjCkgL0BSDbxv0",
  authDomain: "splito-2e33f.firebaseapp.com",
  databaseURL: "https://splito-2e33f-default-rtdb.firebaseio.com",
  projectId: "splito-2e33f",
  storageBucket: "splito-2e33f.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;