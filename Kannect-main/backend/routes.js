const express = require('express');
const router = express.Router();

// Registration: Data collection, verification, role assignment
router.post('/register', registerUser);
// Login & authentication
router.post('/login', authenticateUser);
// Dashboard route
router.get('/dashboard', authenticateJWT, getDashboard);
// Messaging
router.post('/message', authenticateJWT, sendMessage);
// Notifications
router.get('/notifications', authenticateJWT, getNotifications);
// Accessibility & user profile
router.get('/user', authenticateJWT, getUserProfile);

module.exports = router;