// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXxYourFirebaseAPIKey",
    authDomain: "fallalertapp-9b1fa.firebaseapp.com",
    projectId: "fallalertapp-9b1fa",
    storageBucket: "fallalertapp-9b1fa.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Backend API URL
const API_URL = 'https://us-central1-fallalertapp-9b1fa.cloudfunctions.net/api';

// Current user
let currentUser = null;
let authToken = null;
