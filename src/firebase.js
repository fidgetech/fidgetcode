// import { initializeApp, getApps } from "firebase/app";
// import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
}

// if (!getApps().length) {
//   const app = initializeApp(firebaseConfig);
//   initializeAppCheck(app, {
//     provider: new ReCaptchaEnterpriseProvider(process.env.REACT_APP_RECAPTCHA_SITE_KEY),
//     isTokenAutoRefreshEnabled: true
//   });
// }

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);