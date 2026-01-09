const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');
require('dotenv').config();

// Check if DATABASE_URL is configured
const isDatabaseConfigured = process.env.DATABASE_URL;

let pool = null;

if (isDatabaseConfigured) {
  // Configure Neon for WebSocket in Node.js
  neonConfig.webSocketConstructor = ws;

  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  // Test connection
  pool.on('connect', () => {
    console.log(' Connected to Neon PostgreSQL database');
  });

  pool.on('error', (err) => {
    console.error(' Unexpected error on idle client', err);
  });
} else {
  console.warn('  No valid DATABASE_URL configured. Running in demo mode without database.');
  console.warn('  Please set up a Neon database and update DATABASE_URL in .env file.');
}

// Initialize database tables
const initDatabase = async () => {
  if (!isDatabaseConfigured) {
    console.log('  Skipping database initialization (no valid DATABASE_URL)');
    return;
  }
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create polls table
    await client.query(`
      CREATE TABLE IF NOT EXISTS polls (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        question VARCHAR(100) NOT NULL,
        options JSONB NOT NULL,
        duration INTEGER NOT NULL CHECK (duration > 0 AND duration <= 60),
        start_time BIGINT NOT NULL,
        status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create votes table with unique constraint
    await client.query(`
      CREATE TABLE IF NOT EXISTS votes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
        student_id VARCHAR(255) NOT NULL,
        option_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(poll_id, student_id)
      )
    `);

    // Create participants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS participants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        socket_id VARCHAR(255) NOT NULL,
        is_kicked BOOLEAN DEFAULT false,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create chat_messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        sender_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_polls_status ON polls(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_votes_poll_id ON votes(poll_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_participants_socket_id ON participants(socket_id)');

    await client.query('COMMIT');
    console.log(' Database tables initialized successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(' Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Query wrapper that handles missing database
const query = async (text, params) => {
  if (!isDatabaseConfigured || !pool) {
    throw new Error('Database not configured. Please set up Neon PostgreSQL.');
  }
  return pool.query(text, params);
};

module.exports = { pool, initDatabase, query, isDatabaseConfigured };
