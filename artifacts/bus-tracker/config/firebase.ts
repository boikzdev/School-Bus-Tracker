import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "YOUR_API_KEY",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "YOUR_AUTH_DOMAIN",
  databaseURL: process.env.EXPO_PUBLIC_FIREBASE_DATABASE_URL ?? "YOUR_DATABASE_URL",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? "YOUR_PROJECT_ID",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "YOUR_SENDER_ID",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? "YOUR_APP_ID",
};

let app: FirebaseApp;
let database: Database;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  database = getDatabase(app);
} catch (e) {
  console.warn("Firebase initialization failed. Please update config/firebase.ts with your credentials.");
  app = {} as FirebaseApp;
  database = {} as Database;
}

export { app, database };
