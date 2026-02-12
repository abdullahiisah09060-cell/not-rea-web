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

// --- AUTH LOGIC ---
function login() {
    const e = document.getElementById('l-email').value.trim().toLowerCase();
    const p = document.getElementById('l-pass').value;
    if(!e || !p) return alert("Details required");

    auth.signInWithEmailAndPassword(e, p).then(u => {
        window.location.href = (u.user.email === "abdullahiisah09060@gmail.com") ? 'admin_dashboard.html' : 'dashboard.html';
    }).catch(err => alert(err.message));
}

function signup() {
    const n = document.getElementById('s-name').value.trim();
    const e = document.getElementById('s-email').value.trim().toLowerCase();
    const p = document.getElementById('s-pass').value;
    if(!n || !e || !p) return alert("Fill all fields");

    auth.createUserWithEmailAndPassword(e, p).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            fullName: n, email: e, balance: 0, status: 'Active', uid: cred.user.uid
        });
    }).then(() => window.location.href = 'dashboard.html').catch(err => alert(err.message));
}

function logout() { auth.signOut().then(() => window.location.href = 'index.html'); }

// --- LIVE CHAT ENGINE ---
function listenToChat(email, containerId, isUserSide) {
    const box = document.getElementById(containerId);
    if (!box) return;

    db.collection('chats')
      .where('userEmail', '==', email)
      .orderBy('timestamp', 'asc')
      .onSnapshot(snap => {
          // Fixed: The welcome message is now permanent
          let html = isUserSide ? '<div class="bubble a-msg">Hello! Welcome to SBA Support. How can we help you?</div>' : '';
          
          snap.forEach(doc => {
              const d = doc.data();
              const side = d.sender === 'user' ? (isUserSide ? 'u-msg' : 'b-usr') : (isUserSide ? 'a-msg' : 'b-adm');
              
              if (isUserSide) {
                  html += `<div class="bubble ${side}">${d.message}</div>`;
              } else {
                  const style = d.sender === 'admin' ? 'background:#3498db; align-self:flex-end;' : 'background:#2c2f36;';
                  html += `<div style="padding:10px; border-radius:10px; max-width:80%; margin:5px; color:white; ${style}">${d.message}</div>`;
              }
          });
          box.innerHTML = html;
          box.scrollTop = box.scrollHeight;
      });
}
