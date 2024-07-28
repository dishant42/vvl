import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:"AIzaSyA_2H-SlXs0w4OpaEF4eSgUhfkkZNLUT0k",
  authDomain: "mern-estate-91468.firebaseapp.com",
  projectId: "mern-estate-91468",
  storageBucket: "mern-estate-91468.appspot.com",
  messagingSenderId: "440843351933",
  appId: "1:440843351933:web:d1cbd07db620528baa3e14"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);