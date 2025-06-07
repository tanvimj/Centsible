// LoginSignup/server.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ─── 1) MIDDLEWARE TO PARSE JSON ─────────────────────────────────────────
app.use(express.json());

// ─── 2) SERVE LOGIN/SIGNUP STATIC FILES ─────────────────────────────────
// This makes everything in LoginSignup/public available at “/…”
app.use(express.static(path.join(__dirname, 'public')));

// ─── 3) SERVE MAINPAGE STATIC FILES ────────────────────────────────────
// When the browser requests “/MainPage/...”, serve from HOHO/MainPage
app.use(
  '/MainPage',
  express.static(path.join(__dirname, '..', 'MainPage'))
);

// ─── 4) ROUTE: POST /auth (handles both signup & login) ─────────────────
app.post('/auth', (req, res) => {
  const { email, password, action } = req.body;
  if (!email || !password || !action) {
    // Missing a field
    return res.status(400).send('Missing required fields.');
  }

  // Read existing users.json (create empty array if file missing or empty)
  fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
    let users = [];
    if (!err && data) {
      try {
        users = JSON.parse(data);
      } catch {
        return res.status(500).send('Error parsing users data.');
      }
    }

    if (action === 'signup') {
      // ─── SIGNUP LOGIC ───────────────────────────────────────────────────
      const exists = users.find(u => u.email === email);
      if (exists) {
        return res.status(400).send('User already exists. Please log in.');
      }
      users.push({ email, password });
      fs.writeFile(
        path.join(__dirname, 'users.json'),
        JSON.stringify(users, null, 2),
        err => {
          if (err) return res.status(500).send('Error saving user.');
          // On success, send 200 OK
          return res.status(200).send('Signup successful.');
        }
      );
    }
    else if (action === 'login') {
      // ─── LOGIN LOGIC ────────────────────────────────────────────────────
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        return res.status(200).send('Login successful.');
      } else {
        return res.status(401).send('Invalid email or password.');
      }
    }
    else {
      return res.status(400).send('Invalid action.');
    }
  });
});

// ─── 5) START SERVER ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
