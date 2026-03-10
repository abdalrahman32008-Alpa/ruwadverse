import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAEfhIDopfhue9H9Y_RVe1YsFytJcSsChw",
  authDomain: "ruwadverse.firebaseapp.com",
  projectId: "ruwadverse",
  storageBucket: "ruwadverse.firebasestorage.app",
  messagingSenderId: "828930807958",
  appId: "1:828930807958:web:5dbea5cda39d1c1ebe8ab7",
  measurementId: "G-DN62YT2J4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
