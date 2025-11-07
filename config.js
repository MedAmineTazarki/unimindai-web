// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDngFySnvX7pDkNVA1LftccwbDuqZfi7N8",
  authDomain: "fallalertapp-9b1fa.firebaseapp.com",
  projectId: "fallalertapp-9b1fa",
  storageBucket: "fallalertapp-9b1fa.firebasestorage.app",
  messagingSenderId: "484310993155",
  appId: "1:484310993155:web:55e6d769c9740185550136",
  measurementId: "G-KQD8FJ3SWT"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Backend API URL (à déployer)
const API_URL = 'https://us-central1-fallalertapp-9b1fa.cloudfunctions.net/api';

// Current user
let currentUser = null;
let authToken = null;

console.log('Firebase initialized for UnimindAI');
console.log('Project:', firebaseConfig.projectId);
