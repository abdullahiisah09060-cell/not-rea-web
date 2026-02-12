const firebaseConfig = {
  apiKey: "AIzaSyDv4-CogG4VR7_NMH3AEEvt2ArWWw6f2m0",
  authDomain: "sba-grant-us.firebaseapp.com",
  projectId: "sba-grant-us",
  storageBucket: "sba-grant-us.firebasestorage.app",
  messagingSenderId: "458051323380",
  appId: "1:458051323380:web:1f6ef0823034a3fed7a5a1"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const auth = firebase.auth();
const db = firebase.firestore();

// --- LOGIN FUNCTION (The part that was missing) ---
function login() {
    const e = document.getElementById('l-email').value.trim().toLowerCase();
    const p = document.getElementById('l-pass').value;

    if(!e || !p) return alert("Please enter email and password");

    auth.signInWithEmailAndPassword(e, p).then((userCredential) => {
        const user = userCredential.user;
        // Check if it's the Admin email from your Firebase list
        if (user.email === "abdullahiisah09060@gmail.com") {
            window.location.href = 'admin_dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }).catch(err => {
        alert("Login Error: " + err.message);
    });
}

// --- SIGNUP FUNCTION ---
function signup() {
    const n = document.getElementById('s-name').value.trim();
    const e = document.getElementById('s-email').value.trim().toLowerCase();
    const p = document.getElementById('s-pass').value;
    
    // Check if the checkbox is checked
    const terms = document.getElementById('terms-check');
    if(terms && !terms.checked) return alert("You must agree to the Terms & Conditions");

    if(!n || !e || !p) return alert("Please fill all fields");

    const btn = document.getElementById('reg-btn');
    btn.disabled = true;

    auth.createUserWithEmailAndPassword(e, p).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            fullName: n,
            email: e,
            balance: 0,
            status: 'Active'
        });
    }).then(() => {
        window.location.href = 'dashboard.html';
    }).catch(err => {
        alert(err.message);
        btn.disabled = false;
    });
}

// --- LOGOUT FUNCTION ---
function logout() {
    if(confirm("Logout?")) { auth.signOut().then(() => window.location.href = 'index.html'); }
}
