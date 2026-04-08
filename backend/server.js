const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/recommend', require('./routes/recommendRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Register user's socket
  socket.on('register', (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
  });

  // Handle chat messages
  socket.on('sendMessage', (data) => {
    const { receiverId, message } = data;
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('receiveMessage', message);
    }
  });

  // Handle typing indicator
  socket.on('typing', ({ receiverId, senderId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('userTyping', senderId);
    }
  });

  socket.on('stopTyping', ({ receiverId, senderId }) => {
    const receiverSocket = onlineUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit('userStopTyping', senderId);
    }
  });

  // Handle booking status updates (real-time notification)
  socket.on('bookingUpdate', (data) => {
    const { targetUserId, booking } = data;
    const targetSocket = onlineUsers.get(targetUserId);
    if (targetSocket) {
      io.to(targetSocket).emit('bookingNotification', booking);
    }
  });

  socket.on('bookingLocationUpdate', (data) => {
    const { targetUserId, location } = data;
    const targetSocket = onlineUsers.get(targetUserId);
    if (targetSocket) {
      io.to(targetSocket).emit('bookingLocationUpdated', location);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    io.emit('onlineUsers', Array.from(onlineUsers.keys()));
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Fixify API running on port ${PORT}`);
  console.log(`📡 Socket.io ready for connections`);
});
