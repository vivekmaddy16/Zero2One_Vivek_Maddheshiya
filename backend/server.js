const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load env
dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000'
];
const corsOrigins = [...new Set([...defaultOrigins, ...allowedOrigins])];
const corsOptions = {
  origin(origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

// Socket.io setup
const io = new Server(server, {
  cors: corsOptions
});

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/ratings', require('./routes/ratingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/recommend', require('./routes/recommendRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));

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

  // Handle provider availability updates (broadcast to all)
  socket.on('availabilityUpdate', (data) => {
    // Broadcast to all connected clients so service cards update in real-time
    socket.broadcast.emit('providerAvailabilityChanged', data);
  });

  // Handle emergency request notifications
  socket.on('emergencyRequest', (data) => {
    const { targetProviderIds, booking } = data;
    if (targetProviderIds && Array.isArray(targetProviderIds)) {
      targetProviderIds.forEach((providerId) => {
        const providerSocket = onlineUsers.get(providerId);
        if (providerSocket) {
          io.to(providerSocket).emit('emergencyBookingReceived', booking);
        }
      });
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
