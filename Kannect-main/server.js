const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');

const sequelize = require('./db');
const User = require('./models/User');
const Message = require('./models/Message');
const Contact = require('./models/Contact');
const ContactRequest = require('./models/ContactRequest');

const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const messagesRoutes = require('./routes/messages');
const contactRoutes = require('./routes/routes_contact_Version3');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'insecure_dev_secret';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api', contactRoutes);

// A tiny health route
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Authenticate socket with JWT
  socket.on('authenticate', (token) => {
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      socket.user = payload;
      socket.join(`user_${payload.id}`); // Join a room for the user
      console.log(`User ${payload.name} authenticated`);
    } catch (err) {
      socket.emit('unauthenticated', 'Invalid token');
      socket.disconnect();
    }
  });

  // Handle sending message
  socket.on('sendMessage', async (data) => {
    if (!socket.user) return;
    const { to, content, type = 'text', filePath } = data;
    try {
      const msg = await Message.create({
        senderId: socket.user.id,
        receiverId: to,
        content,
        type,
        filePath
      });
      // Emit to receiver's room
      io.to(`user_${to}`).emit('newMessage', {
        id: msg.id,
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content,
        type: msg.type,
        filePath: msg.filePath,
        createdAt: msg.createdAt,
        sender: { id: socket.user.id, name: socket.user.name, role: socket.user.role }
      });
      // Also emit back to sender for confirmation
      socket.emit('messageSent', { id: msg.id });
    } catch (err) {
      console.error('Error sending message:', err);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Sync DB and start server
(async () => {
  try {
    await sequelize.sync();
    const MAX_PORT_TRIES = 5;

    const startServer = (port, triesLeft) => {
      server.listen(port);
      server.on('listening', () => {
        console.log(`Server listening at http://localhost:${port}`);
        console.log('Open http://localhost:' + port + '/index.html');
      });
      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && triesLeft > 0) {
          console.warn(`Port ${port} in use, trying ${port + 1}...`);
          setTimeout(() => startServer(port + 1, triesLeft - 1), 200);
        } else {
          console.error('Failed to start server', err);
          process.exit(1);
        }
      });
    };

    startServer(PORT, MAX_PORT_TRIES);
  } catch (err) {
    console.error('Failed to start server', err);
  }
})();
