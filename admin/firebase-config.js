// ============================================================
// Firebase initialization (shared by admin.js and script.js)
// Syncs every admin-managed section across browsers/devices in
// addition to local browser storage. Loaded via CDN <script>
// tags before admin.js / script.js, so it must stay compatible
// with the Firebase "compat" (non-module) SDK.
//
// The values below are a Firebase *web app configuration*, not a
// secret: every browser needs them to reach the project, so they
// cannot be hidden from page source. What actually protects the
// project is the API key restriction in Google Cloud Console plus
// the Firestore security rules - see firestore.rules and
// admin/FIREBASE-SETUP.md. Never place a private key, service
// account or other admin credential in this file.
// ============================================================

const firebaseConfig = {
    apiKey: "AIzaSyCeQMG9EKm7JhhXGcf9iVQazXKgEKKUN1M",
    authDomain: "jitendra-sharma-portfoli-945d6.firebaseapp.com",
    projectId: "jitendra-sharma-portfoli-945d6",
    storageBucket: "jitendra-sharma-portfoli-945d6.firebasestorage.app",
    messagingSenderId: "856409412134",
    appId: "1:856409412134:web:63904ec719db1fb18f8ce7",
    measurementId: "G-P36JMNBXK0"
};

try {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    // firebase-auth-compat.js is only loaded by the admin panel. On the public
    // site this stays null and no authentication code path is ever reached.
    window.auth = typeof firebase.auth === 'function' ? firebase.auth() : null;
} catch (e) {
    console.error('Firebase failed to initialize:', e);
    window.db = null;
    window.auth = null;
}
