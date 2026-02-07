const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendMail } = require('../mailer');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'insecure_dev_secret';

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !['teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'name, email, password and role (teacher|student) are required' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();
    const user = await User.create({ name, email, passwordHash, role, verificationToken, verified: false });

    // send verification email
    const verifyUrl = `${req.protocol}://${req.get('host')}/api/auth/verify?token=${verificationToken}`;
    const html = `<p>Hello ${name},</p>
      <p>Click to verify your email and activate your account:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>`;
    await sendMail({ to: email, subject: 'Verify your account', html, text: `Verify: ${verifyUrl}` });

    res.json({ message: 'Registered. Verification email sent. Check server logs if using Ethereal.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// Verify
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send('missing token');
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) return res.status(404).send('Invalid token');
    user.verified = true;
    user.verificationToken = null;
    await user.save();
    // Redirect to a simple page or send JSON
    res.send('<h2>Email verified. You can close this window and login.</h2>');
  } catch (err) {
    console.error(err);
    res.status(500).send('server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  if (!user.verified) return res.status(403).json({ error: 'email not verified' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;