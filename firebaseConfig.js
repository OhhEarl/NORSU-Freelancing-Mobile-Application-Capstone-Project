// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from '@react-native-firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDa4YGP991nVxY0kNebQ_IHR0WItN1H4Ds",
    authDomain: "norsu-freelancing-7d899.firebaseapp.com",
    projectId: "norsu-freelancing-7d899",
    storageBucket: "norsu-freelancing-7d899.appspot.com",
    messagingSenderId: "190437700260",
    appId: "1:190437700260:web:ad89b2c78e36b7bed72c31"
  };

  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);