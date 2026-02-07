// User schema
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed!
  role: { type: String, enum: ['teacher', 'student'] },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);