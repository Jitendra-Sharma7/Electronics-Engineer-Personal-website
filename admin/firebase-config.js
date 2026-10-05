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
} catch (e) {
    console.error('Firebase failed to initialize:', e);
    window.db = null;
}
