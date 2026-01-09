const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const pollRoutes = require('./routes/poll.routes');
const voteRoutes = require('./routes/vote.routes');
const participantRoutes = require('./routes/participant.routes');
const PollSocket = require('./sockets/poll.socket');
const participantService = require('./services/participant.service');

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'https://intervue-poll-07.vercel.app', 
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/participants', participantRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Intervue Poll API', 
    version: '1.0.0',
    endpoints: {
      polls: '/api/polls',
      votes: '/api/votes',
      participants: '/api/participants',
      health: '/health'
    }
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize Socket.io
const pollSocket = new PollSocket(io);
pollSocket.initialize();

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();

    // Clean up duplicate participants and old data
    await participantService.cleanupDuplicates();
    
    // Clear old votes and participants (for development)
    const { pool } = require('./config/database');
    await pool.query('DELETE FROM votes');
    await pool.query('DELETE FROM participants');
    await pool.query('DELETE FROM chat_messages');
    

    // Start listening
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(' Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});

module.exports = { app, server, io };

