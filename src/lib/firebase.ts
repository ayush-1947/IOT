// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Add this if you're using Realtime Database

// Optional: Only if you're using analytics in the browser
import { getAnalytics, isSupported } from "firebase/analytics";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCueME3lPNGojQHutcBMM5GKy-SomX6KNQ",
  authDomain: "iotdashboard-6c9eb.firebaseapp.com",
  projectId: "iotdashboard-6c9eb",
  storageBucket: "iotdashboard-6c9eb.appspot.com",
  messagingSenderId: "94659879550",
  appId: "1:94659879550:web:4f47f0e76ea647adf82e2f",
  measurementId: "G-81R3VBS24X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Realtime Database setup
const db = getDatabase(app);

// Optional: Analytics (only if you're on the client side)
let analytics: ReturnType<typeof getAnalytics> | null = null;
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) analytics = getAnalytics(app);
  });
}

export { db };
