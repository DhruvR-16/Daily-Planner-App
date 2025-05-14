import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDw21hxKeO12nwNYy000O_n92mzERTX2UI",
  authDomain: "plan-76dda.firebaseapp.com",
  projectId: "plan-76dda",
  storageBucket: "plan-76dda.appspot.com",
  messagingSenderId: "1054190949747",
  appId: "1:1054190949747:web:977735144d7e01857d6106",
  measurementId: "G-3BRJT5HYTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firebase Analytics conditionally (will not run in test environments)
let analytics = null;
// Only initialize analytics if supported (not in test environments or where cookies are disabled)
isSupported().then(supported => {
  if (supported) {
    analytics = getAnalytics(app);
  }
}).catch(error => {
  console.warn("Analytics not supported:", error);
});

export { auth, analytics, app };