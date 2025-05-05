import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging, onMessage } from "firebase/messaging";
import { toast } from "react-toastify";
import { Environment } from "@/environment";

const firebaseConfig = {
  apiKey: Environment.FIREBASE_API_KEY,
  authDomain: Environment.FIREBASE_AUTH_DOMAIN,
  projectId: Environment.FIREBASE_PROJECT_ID,
  storageBucket: Environment.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Environment.FIREBASE_MESSAGING_SENDER_ID,
  appId: Environment.FIREBASE_APP_ID,
  measurementId: Environment.FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const messaging = getMessaging(app);

onMessage(messaging, (payload) => {
  console.log("Message received:", payload);
  const { title } = payload.notification;
  toast.info(title);
});

const db = getFirestore(app);
export { messaging, db, app };
