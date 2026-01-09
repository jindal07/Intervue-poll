# Intervue Poll Backend

Resilient Live Polling System Backend with Node.js, Express, Socket.io, and PostgreSQL.

## Setup

1. Install PostgreSQL and create a database:
```bash
createdb intervue_poll
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your PostgreSQL credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/intervue_poll
```

5. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will automatically create the required database tables on startup.

## API Endpoints

### Polls
- `POST /api/polls` - Create a new poll
- `GET /api/polls/active` - Get the active poll
- `GET /api/polls/history` - Get completed polls
- `GET /api/polls/:id` - Get poll by ID
- `PUT /api/polls/:id/complete` - Complete a poll
- `GET /api/polls/:id/results` - Get poll results

### Votes
- `POST /api/votes` - Submit a vote
- `GET /api/votes/:pollId/:studentId` - Get student's vote
- `GET /api/votes/:pollId/:studentId/check` - Check if student voted

### Participants
- `GET /api/participants` - Get all participants
- `GET /api/participants/:id` - Get participant by ID
- `DELETE /api/participants/:id/kick` - Kick a participant

## Socket.io Events

### Client → Server
- `student:join` - Student joins the session
- `teacher:join` - Teacher joins the session
- `poll:create` - Create a new poll
- `vote:submit` - Submit a vote
- `chat:send` - Send a chat message
- `participant:kick` - Kick a participant
- `state:request` - Request current state

### Server → Client
- `state:sync` - Send current state
- `poll:created` - New poll created
- `poll:updated` - Poll results updated
- `poll:completed` - Poll completed
- `vote:submitted` - Vote acknowledged
- `vote:error` - Vote submission error
- `chat:message` - New chat message
- `chat:history` - Chat history
- `participants:updated` - Participant list updated
- `participant:kicked` - Participant was kicked
- `error` - General error

## Architecture

```
backend/
├── config/          # Database configuration
├── models/          # Data access layer
├── services/        # Business logic
├── controllers/     # HTTP request handlers
├── routes/          # API routes
├── sockets/         # Socket.io event handlers
├── middleware/      # Express middleware
└── server.js        # Application entry point
```

## Database Schema

### polls
- id (UUID)
- question (VARCHAR 100)
- options (JSONB)
- duration (INTEGER, 1-60)
- start_time (BIGINT)
- status (active | completed)
- created_at (TIMESTAMP)

### votes
- id (UUID)
- poll_id (UUID, FK)
- student_id (VARCHAR)
- option_id (VARCHAR)
- created_at (TIMESTAMP)
- UNIQUE(poll_id, student_id)

### participants
- id (UUID)
- name (VARCHAR)
- socket_id (VARCHAR)
- is_kicked (BOOLEAN)
- joined_at (TIMESTAMP)

### chat_messages
- id (UUID)
- sender_name (VARCHAR)
- message (TEXT)
- created_at (TIMESTAMP)

