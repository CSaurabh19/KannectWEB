const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  // TODO: Hash password, send email verification, etc.
  try {
    const user = new User({ name, email, password, role, verified: true });
    await user.save();
    res.status(201).json({ message: 'User registered!', user });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  // TODO: Proper authentication, token issuance
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ message: 'Login successful', user });
});

// Role-based Dashboard
router.get('/dashboard/:role', async (req, res) => {
  const { role } = req.params;
  // Example static data, expand as needed
  const data = role === 'faculty' ? { courses: ['CSE101', 'MATH104'], messages: [] }
                                  : { assignments: [], messages: [] };
  res.json({ dashboard: data });
});

// Basic Messaging route
router.post('/message', (req, res) => {
  // Example stub - implement with a Message model and socket.io for real-time!
  res.json({ status: 'Message sent', message: req.body });
});

module.exports = router;