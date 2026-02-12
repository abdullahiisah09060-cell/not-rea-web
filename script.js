// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDv4-CogG4VR7_NMH3AEEvt2ArWWw6f2m0",
  authDomain: "sba-grant-us.firebaseapp.com",
  projectId: "sba-grant-us",
  storageBucket: "sba-grant-us.firebasestorage.app",
  messagingSenderId: "458051323380",
  appId: "1:458051323380:web:1f6ef0823034a3fed7a5a1"
};

// Initialize Firebase correctly
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// DEFINE GLOBALLY - This fixes the "auth is not defined" error
const auth = firebase.auth();
const db = firebase.firestore();

// --- LOGIN FUNCTION ---
function login() {
    const e = document.getElementById('l-email').value.trim().toLowerCase();
    const p = document.getElementById('l-pass').value;

    if(!e || !p) return alert("Please enter email and password");

    auth.signInWithEmailAndPassword(e, p).then((userCredential) => {
        const user = userCredential.user;
        // Redirect based on email
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
    const terms = document.getElementById('terms-check');

    if(terms && !terms.checked) return alert("You must agree to the Terms & Conditions");
    if(!n || !e || !p) return alert("Please fill all fields");

    auth.createUserWithEmailAndPassword(e, p).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            fullName: n,
            email: e,
            balance: 0,
            status: 'Active',
            uid: cred.user.uid
        });
    }).then(() => {
        window.location.href = 'dashboard.html';
    }).catch(err => alert(err.message));
}

// --- LOGOUT FUNCTION ---
function logout() {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
}

// --- LIVE CHAT ENGINE ---
// email: the user email to track, containerId: where to show messages, isUserSide: true for user page
function listenToChat(email, containerId, isUserSide) {
    const box = document.getElementById(containerId);
    if (!box) return;

    db.collection('chats')
      .where('userEmail', '==', email)
      .orderBy('timestamp', 'asc')
      .onSnapshot(snap => {
          // Keep welcome message on user side
          box.innerHTML = isUserSide ? '<div class="bubble a-msg">Hello! How can we help you today?</div>' : '';
          
          snap.forEach(doc => {
              const d = doc.data();
              const side = d.sender === 'user' ? (isUserSide ? 'u-msg' : 'b-usr') : (isUserSide ? 'a-msg' : 'b-adm');
              
              if (isUserSide) {
                  box.innerHTML += `<div class="bubble ${side}">${d.message}</div>`;
              } else {
                  const style = d.sender === 'admin' ? 'background:#3498db; align-self:flex-end;' : 'background:#2c2f36;';
                  box.innerHTML += `<div style="padding:10px; border-radius:10px; max-width:80%; margin:5px; color:white; ${style}">${d.message}</div>`;
              }
          });
          box.scrollTop = box.scrollHeight;
      }, err => console.error("Chat error:", err));
}
