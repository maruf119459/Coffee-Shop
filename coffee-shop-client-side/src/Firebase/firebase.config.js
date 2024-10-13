// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTEsAmJwRqTz-LRmntVvid0AFOIBZtaeU",
  authDomain: "coffee-shope-358af.firebaseapp.com",
  projectId: "coffee-shope-358af",
  storageBucket: "coffee-shope-358af.appspot.com",
  messagingSenderId: "186617657890",
  appId: "1:186617657890:web:702469447dd96c2411687b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;