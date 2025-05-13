import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQY2M2sRmn8k2zQQADZwhL6mSzewJv0JU",
  authDomain: "ekofoods-36e62.firebaseapp.com",
  projectId: "ekofoods-36e62",
  storageBucket: "ekofoods-36e62.appspot.com",
  messagingSenderId: "556763624110",
  appId: "1:556763624110:web:eeb204dc22c82f6513b33f",
  measurementId: "G-6ZMEWCFB3Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;

// Initialize analytics only in the browser
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);

export { auth, analytics, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential };
