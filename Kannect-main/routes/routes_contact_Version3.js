const express = require('express');
const router = express.Router();
const ContactRequest = require('../models/ContactRequest');
const Contact = require('../models/Contact');
const User = require('../models/User')
const Message = require('../models/Message');

// Middleware to get current user from token/session
const auth = require('../middleware/auth');

// Send a contact request
router.post('/contacts/request', auth, async (req, res) => {
  const { to } = req.body;
  if (to === req.user.id) return res.status(400).json({ error: "Cannot request yourself" });
  const exists = await ContactRequest.findOne({ where: { fromId: req.user.id, toId: to, status: 'pending' } });
  if (exists) return res.status(400).json({ error: 'Request already sent' });
  await ContactRequest.create({ fromId: req.user.id, toId: to });
  res.json({ message: 'Request sent.' });
});

// Accept a contact request
router.post('/contacts/accept', auth, async (req, res) => {
  const { requestId } = req.body;
  const reqDoc = await ContactRequest.findOne({ where: { id: requestId, toId: req.user.id, status: 'pending' } });
  if (!reqDoc) return res.status(404).json({ error: 'Request not found' });
  reqDoc.status = 'accepted';
  await reqDoc.save();
  // Create contact (if not exists)
  let contact = await Contact.findOne({
    include: [
      { model: User, where: { id: [req.user.id, reqDoc.fromId] }, required: false }
    ]
  });
  if (!contact) {
    contact = await Contact.create({});
    await contact.addUsers([req.user.id, reqDoc.fromId]);
  }
  // Send a welcome message with the contact ID
  const welcomeMessage = `Hello! We've connected. Your contact ID is ${reqDoc.fromId}.`;
  await Message.create({ senderId: req.user.id, receiverId: reqDoc.fromId, content: welcomeMessage, type: 'text' });
  res.json({ message: 'Contact accepted.' });
});

// Block a contact
router.post('/contacts/block', auth, async (req, res) => {
  const { userId } = req.body;
  let contact = await Contact.findOne({
    include: [
      { model: User, where: { id: [req.user.id, userId] }, required: false }
    ]
  });
  if (!contact) return res.status(404).json({ error: 'Contact not found' });
  contact.blockedById = req.user.id;
  await contact.save();
  res.json({ message: 'Contact blocked.' });
});

// List my contacts
router.get('/contacts', auth, async (req, res) => {
  // Show accepted contacts only
  const contacts = await Contact.findAll({
    where: { blockedById: null },
    include: [
      {
        model: User
      }
    ]
  });
  // Filter to only include contacts where the user is part of the contact
  const userContacts = contacts.filter(contact => contact.Users.some(u => u.id === req.user.id));
  res.json(userContacts);
});

// List my incoming requests
router.get('/contacts/requests', auth, async (req, res) => {
  const requests = await ContactRequest.findAll({
    where: { toId: req.user.id, status: 'pending' },
    include: [{ model: User, as: 'fromUser' }]
  });
  res.json(requests);
});

// List my outgoing requests
router.get('/contacts/requests/sent', auth, async (req, res) => {
  const requests = await ContactRequest.findAll({
    where: { fromId: req.user.id, status: 'pending' },
    include: [{ model: User, as: 'toUser' }]
  });
  res.json(requests);
});

// Decline a request
router.post('/contacts/decline', auth, async (req, res) => {
  const { requestId } = req.body;
  const reqDoc = await ContactRequest.findOne({ where: { id: requestId, toId: req.user.id, status: 'pending' } });
  if (!reqDoc) return res.status(404).json({ error: 'Request not found' });
  reqDoc.status = 'declined';
  await reqDoc.save();
  res.json({ message: 'Contact request declined.' });
});

module.exports = router;