import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined = undefined;
let db: Firestore | undefined = undefined;

if (!firebaseConfig.projectId) {
  console.error(
    "Firebase Project ID is missing (NEXT_PUBLIC_FIREBASE_PROJECT_ID in .env). Please check your Firebase project settings and .env file.",
  );
} else if (
  firebaseConfig.projectId.includes(".firebasestorage.app") ||
  firebaseConfig.projectId.includes(".firebaseapp.com")
) {
  console.error(
    `Firebase Project ID appears to be incorrect: "${firebaseConfig.projectId}". It looks like a storage bucket or hosting URL. It should be your Firebase Project ID (e.g., "your-project-name"). Please correct NEXT_PUBLIC_FIREBASE_PROJECT_ID in your .env file.`,
  );
} else {
  // Only attempt to initialize if projectId seems valid
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (app) {
    db = getFirestore(app);
  }
}

// Export potentially undefined app and db, components should handle this.
export { app, db };
