const switchButton = document.getElementById('switch-button');
const actionButton = document.getElementById('action-button');
const welcomeText = document.getElementById('welcome-text');
const form = document.getElementById('auth-form');

let isSignUp = true; 

switchButton.addEventListener('click', () => {
  isSignUp = !isSignUp;
  if (isSignUp) {
    welcomeText.textContent = "Welcome.";
    actionButton.textContent = "Sign Up";
    switchButton.textContent = "Or, log in.";
  } else {
    welcomeText.textContent = "Log in.";
    actionButton.textContent = "Log In";
    switchButton.textContent = "Or, sign up.";
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  const action = isSignUp ? "signup" : "login";

  try {
    const res = await fetch('/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, action })
    });

    const message = await res.text();
    alert(message);
  } catch (err) {
    alert('Error connecting to server');
  }
});
fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
})
.then(res => res.text())
.then(message => {
  if (message.includes('Welcome back')) {
    window.location.href = 'MainPage/index.html';
  } else {
    alert(message);
  }
});

document.getElementById('auth-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;

  const endpoint = '/signup';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const text = await response.text();

    if (response.ok) {
      window.location.href = 'MainPage/index.html'; 
    } else {
      alert(text);
    }
  } catch (error) {
    alert('Something went wrong, try again.');
    console.error(error);
  }
});

