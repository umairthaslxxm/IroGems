// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1gJ7-2Nk43UvSp4pVnBIh5GZLKlmMnb0",
    authDomain: "iro-gems.firebaseapp.com",
    projectId: "iro-gems",
    storageBucket: "iro-gems.firebasestorage.app",
    messagingSenderId: "62813641588",
    appId: "1:62813641588:web:5d9a24be84a28feb52ea21",
    measurementId: "G-Z0BCEMZXY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { app, auth, analytics };
