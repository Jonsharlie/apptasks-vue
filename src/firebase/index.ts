import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {

  apiKey: "AIzaSyBNkrcoAAPwfyCy7TllsE0C8QwKl2ewx0w",

  authDomain: "vue-apps-aff52.firebaseapp.com",

  projectId: "vue-apps-aff52",

  storageBucket: "vue-apps-aff52.appspot.com",

  messagingSenderId: "568056372801",

  appId: "1:568056372801:web:60b0ff5a7ac81c8089b0c0"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export {
    db
}