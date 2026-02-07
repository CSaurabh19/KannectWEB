const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Store securely (hash with bcrypt in production!)
  role: { type: String, enum: ['student', 'faculty'] },
  verified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);