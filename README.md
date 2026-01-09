# Intervue – Resilient Live Polling System

A **real-time, resilient live polling platform** with **Teacher (Admin)** and **Student (User)** personas built with modern serverless architecture.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![Socket.io](https://img.shields.io/badge/Socket.io-4.6-orange) ![Neon](https://img.shields.io/badge/Neon-PostgreSQL-blue) ![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)

## Key Features

- **Real-time Polling** – Live updates via Socket.io
- **State Recovery** – Refresh the page anytime, state is restored
- **Late Join Support** – Students joining mid-poll see correct remaining time
- **Server-Synced Timers** – All clients show the same countdown
- **One Vote Per Student** – Database constraints prevent duplicate votes
- **Live Results** – Real-time percentage bars
- **Chat & Participants** – Real-time communication
- **Kick Functionality** – Teachers can remove students
- **Poll History** – View past polls with results
- **Serverless Architecture** – Deployed on Vercel with Neon Postgres

## Tech Stack

### Frontend
- **Vite** – Lightning-fast build tool
- **React 18** – UI library with hooks
- **Tailwind CSS** – Utility-first styling
- **Socket.io Client** – Real-time communication
- **React Router** – Client-side routing

### Backend
- **Node.js + Express** – Server framework
- **Socket.io** – WebSocket server
- **Neon PostgreSQL** – Serverless Postgres database
- **Vercel Serverless** – Serverless deployment

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Neon PostgreSQL account (free tier available)
- Vercel account (for deployment)

### 1. Clone & Install

```bash
# Clone repository
git clone <your-repo>
cd intervue-assignment

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Neon PostgreSQL

1. Go to [Neon Console](https://console.neon.tech/)
2. Create a new project
3. Copy the connection string
4. Create `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@your-project.neon.tech/intervue_poll?sslmode=require
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Setup Frontend Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

### 4. Run Locally

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Frontend: **http://localhost:3000**  
Backend: **http://localhost:5000**

## Deploy to Vercel

### Deploy Frontend

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy Backend

```bash
cd backend

# Deploy
vercel --prod
```

### Environment Variables on Vercel

In Vercel dashboard, add:

**Backend:**
- `DATABASE_URL`: Your Neon connection string
- `FRONTEND_URL`: Your frontend Vercel URL
- `NODE_ENV`: production

**Frontend:**
- `VITE_API_URL`: Your backend Vercel URL
- `VITE_SOCKET_URL`: Your backend Vercel URL

## Database Schema

### polls
- `id` (UUID, Primary Key)
- `question` (VARCHAR 100)
- `options` (JSONB array)
- `duration` (INTEGER, 1-60 seconds)
- `start_time` (BIGINT timestamp)
- `status` (active | completed)

### votes
- **UNIQUE constraint on (poll_id, student_id)** ← Prevents double voting

### participants & chat_messages
- Real-time data for active sessions

## User Flows

### Student Flow

1. **Select Role** → Choose "I'm a Student"
2. **Enter Name** → Provide your name
3. **Waiting State** → See "Wait for the teacher to ask questions.."
4. **Active Poll** → View question, select option, submit vote
5. **Results** → View live results with percentage bars

### Teacher Flow

1. **Select Role** → Choose "I'm a Teacher"
2. **Create Poll** → Enter question, add options, set duration
3. **View Results** → See live vote counts
4. **Manage** → View history, kick students, use chat

## Resilience Features

### Page Refresh Recovery
```javascript
// Server calculates remaining time on each sync
remainingTime = poll.duration - Math.floor((Date.now() - poll.startTime) / 1000)
```

- Teacher refreshes mid-poll → Poll continues
- Student refreshes → Resumes from correct state
- Late joins → See remaining time (not full duration)

### Vote Validation
- Client-side: Disable submit after voting
- Server-side: Check existing vote
- Database: UNIQUE constraint prevents duplicates

## API Endpoints

### Polls
- `POST /api/polls` – Create poll
- `GET /api/polls/active` – Get active poll
- `GET /api/polls/history` – Poll history

### Votes
- `POST /api/votes` – Submit vote
- `GET /api/votes/:pollId/:studentId/check` – Check if voted

### Participants
- `GET /api/participants` – Get all
- `DELETE /api/participants/:id/kick` – Kick student

## Socket.io Events

### Client → Server
- `student:join`, `teacher:join`
- `poll:create`, `vote:submit`
- `chat:send`, `participant:kick`

### Server → Client
- `state:sync`, `poll:created`
- `poll:updated`, `vote:submitted`
- `chat:message`, `participants:updated`

## Project Structure

```
intervue-assignment/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── components/    # Reusable components (Tailwind)
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── context/       # React Context
│   │   └── utils/         # API client
│   ├── index.html         # Entry HTML
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind configuration
│   └── vercel.json        # Vercel config
│
├── backend/               # Express + Socket.io
│   ├── config/            # Neon DB config
│   ├── models/            # Data access
│   ├── services/          # Business logic
│   ├── controllers/       # HTTP handlers
│   ├── routes/            # API routes
│   ├── sockets/           # Socket.io
│   ├── server.js          # Entry point
│   └── vercel.json        # Vercel config
│
└── vercel.json            # Root Vercel config
```

## Key Technical Decisions

1. **Vite over CRA**: 10x faster builds, better DX
2. **Tailwind CSS**: Utility-first, no CSS files to maintain
3. **Neon Postgres**: Serverless, auto-scaling, generous free tier
4. **Vercel Deployment**: Zero-config, edge network, instant deploys
5. **Server-Synced Timer**: Calculate remaining time server-side
6. **DB Constraints**: UNIQUE(poll_id, student_id) prevents duplicate votes

## Testing Scenarios

Test these key scenarios:

1. Page refresh during active poll
2. Late student join mid-poll
3. Double vote prevention
4. Socket reconnection
5. Real-time updates
6. Chat synchronization
7. Kick student functionality

## Development Commands

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Backend
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
```
# Intervue-poll
