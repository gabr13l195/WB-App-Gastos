import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDWqn7ccegfqyLBPHvgAcGEQXVMFC9Fzx8",
    authDomain: "wb-prueba-appgastos.firebaseapp.com",
    databaseURL: "https://wb-prueba-appgastos-default-rtdb.firebaseio.com/",
    projectId: "wb-prueba-appgastos",
    storageBucket: "wb-prueba-appgastos.firebasestorage.app",
    messagingSenderId: "512017855394",
    appId: "1:512017855394:web:91736e83592ae6742238fb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
