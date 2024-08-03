// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDR-5fJzV2wkHjyFjaifwSU65RN2XZTEyE",
    authDomain: "hs-pantry-app.firebaseapp.com",
    projectId: "hs-pantry-app",
    storageBucket: "hs-pantry-app.appspot.com",
    messagingSenderId: "938666045577",
    appId: "1:938666045577:web:1bcc36d306335ece26d658",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export {app, firestore}
