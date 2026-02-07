const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Always length 2
  blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null } // If blocked, ID of user
});

module.exports = mongoose.model('Contact', ContactSchema);