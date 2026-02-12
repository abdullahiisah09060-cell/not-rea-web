// 1. YOUR FIREBASE CONFIGURATION
// Replace these with your actual Firebase project details
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// 2. LOGOUT FUNCTION (Used by everyone)
function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

// 3. GLOBAL AUTH CHECK (Optional helper)
// This ensures that if a user is logged in, their data stays synced
auth.onAuthStateChanged(user => {
    if (user) {
        console.log("Logged in as:", user.email);
        // You can add global logic here if needed
    }
});

// 4. UTILITY: FORMAT CURRENCY
function formatMoney(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

// 5. PREVENT USER FROM GOING BACK AFTER LOGOUT
if (window.location.pathname.includes('dashboard.html') || window.location.pathname.includes('admin_dashboard.html')) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "index.html";
        }
    });
}
