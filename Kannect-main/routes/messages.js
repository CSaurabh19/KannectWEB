const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'insecure_dev_secret';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'missing authorization' });
  const [, token] = header.split(' ');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

// send a message (text)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { to, content } = req.body;
    if (!to || !content) return res.status(400).json({ error: 'to and content required' });
    const receiver = await User.findByPk(to);
    if (!receiver) return res.status(404).json({ error: 'receiver not found' });

    const msg = await Message.create({ senderId, receiverId: to, content, type: 'text' });
    res.json({ message: 'sent', id: msg.id, createdAt: msg.createdAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// upload and send a file
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const senderId = req.user.id;
    const { to } = req.body;
    if (!to || !req.file) return res.status(400).json({ error: 'to and file required' });
    const receiver = await User.findByPk(to);
    if (!receiver) return res.status(404).json({ error: 'receiver not found' });

    const filePath = req.file.path;
    const content = req.file.originalname; // Use filename as content
    const msg = await Message.create({ senderId, receiverId: to, content, type: 'file', filePath });
    res.json({ message: 'file sent', id: msg.id, createdAt: msg.createdAt, filePath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// get conversation with a user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const withId = Number(req.query.with);
    if (!withId) return res.status(400).json({ error: 'with query param required' });

    const msgs = await Message.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { senderId: userId, receiverId: withId },
          { senderId: withId, receiverId: userId }
        ]
      },
      order: [['createdAt', 'ASC']],
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'role'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'role'] }
      ]
    });

    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = router;
