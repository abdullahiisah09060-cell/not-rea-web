// SBA Project Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv4-CogG4VR7_NMH3AEEvt2ArWWw6f2m0",
  authDomain: "sba-grant-us.firebaseapp.com",
  projectId: "sba-grant-us",
  storageBucket: "sba-grant-us.firebasestorage.app",
  messagingSenderId: "458051323380",
  appId: "1:458051323380:web:1f6ef0823034a3fed7a5a1",
  measurementId: "G-NEE31ZN4JX"
};

// Initialize Firebase only if it hasn't been initialized already
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Global variables for all pages to use
const auth = firebase.auth();
const db = firebase.firestore();

// --- GLOBAL UTILITY FUNCTIONS ---

/**
 * Logout function used in Dashboard and Admin pages
 */
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        console.error("Logout Error:", error);
        alert("Error logging out.");
    });
}

/**
 * Money Formatter
 * Usage: formatMoney(5000) -> "$5,000.00"
 */
function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount || 0);
}

/**
 * Global Auth Check
 * Redirects to login if user session is lost
 */
function checkSession() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'index.html';
        }
    });
}

// Optional: Enable Analytics if you need it
// firebase.analytics();
