import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCg9Hyp3egqKyb4YJCVHJDJcxFyYEvrroI",
  authDomain: "centsible-40125.firebaseapp.com",
  projectId: "centsible-40125",
  storageBucket: "centsible-40125.appspot.com",
  messagingSenderId: "665505386105",
  appId: "1:665505386105:web:cbaeeaf0584fde180a8ea8",
  measurementId: "G-1JVNDTB627"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const switchButton = document.getElementById('switch-button');
const actionButton = document.getElementById('action-button');
const welcomeText = document.getElementById('welcome-text');
const form = document.getElementById('auth-form');
let isSignUp = true;

switchButton.addEventListener('click', () => {
  isSignUp = !isSignUp;
  if (isSignUp) {
    welcomeText.textContent = 'Welcome.';
    actionButton.textContent = 'Sign Up';
    switchButton.textContent = 'Or, log in.';
  } else {
    welcomeText.textContent = 'Log in.';
    actionButton.textContent = 'Log In';
    switchButton.textContent = 'Or, sign up.';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email-input').value.trim();
  const password = document.getElementById('password-input').value.trim();
  
  try {
    if (isSignUp) {
      await createUserWithEmailAndPassword(auth, email, password);
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
    
    console.log("Redirecting now...");
    window.location.href = "../MainPage/index.html";
    
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});
