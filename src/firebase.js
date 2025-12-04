// Firebase config (use placeholders below)
// Install: npm install firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR-API-KEY",
  authDomain: "YOUR-AUTH-DOMAIN",
  projectId: "YOUR-PROJECT-ID",
  appId: "YOUR-APP-ID",
  // ...other keys
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);