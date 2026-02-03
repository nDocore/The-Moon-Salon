import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getDatabase, ref, get, set, push, update, child } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDT4xLbxEruet25PKJyutVMh1dfqpWkn6A",
    authDomain: "the-moon-salon-a7f8a.firebaseapp.com",
    databaseURL: "https://the-moon-salon-a7f8a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "the-moon-salon-a7f8a",
    storageBucket: "the-moon-salon-a7f8a.firebasestorage.app",
    messagingSenderId: "609888312415",
    appId: "1:609888312415:web:c0c32fbfc2dc1d720b4fea",
    measurementId: "G-8Z81H66K68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

export { app, analytics, db, ref, get, set, push, update, child };
