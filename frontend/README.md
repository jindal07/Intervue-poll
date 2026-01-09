# Intervue Poll Frontend

Modern React application built with Vite and Tailwind CSS.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool (10x faster than CRA)
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Runs on **http://localhost:3000**

## Build

```bash
npm run build
```

Output: `dist/` directory

## Preview Build

```bash
npm run preview
```

## Styling with Tailwind

### Custom Colors

Defined in `tailwind.config.js`:

```js
colors: {
  primary: '#7765DA',      // Buttons, CTAs
  secondary: '#5767D0',    // Progress bars
  accent: '#4F0DCE',       // Highlights
  background: '#F2F2F2',   // App background
  textPrimary: '#373737',  // Main text
  textSecondary: '#6E6E6E' // Secondary text
}
```

### Usage

```jsx
<button className="bg-primary text-white px-6 py-3 rounded-full hover:bg-secondary">
  Click me
</button>
```

### Custom Components

Reusable classes in `src/index.css`:

- `.btn-primary` - Primary button
- `.input-field` - Text input
- `.card` - Content card
- `.role-badge` - Badge component
- `.spinner` - Loading spinner

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── ChatButton.jsx
│   ├── ChatPanel.jsx
│   ├── ErrorBoundary.jsx
│   ├── KickedOut.jsx
│   ├── ParticipantsPanel.jsx
│   ├── PollOptions.jsx
│   ├── PollQuestion.jsx
│   ├── PollResults.jsx
│   └── ProtectedRoute.jsx
│
├── pages/           # Page components
│   ├── RoleSelection.jsx
│   ├── StudentName.jsx
│   ├── StudentView.jsx
│   ├── TeacherDashboard.jsx
│   └── PollHistory.jsx
│
├── hooks/           # Custom React hooks
│   ├── useSocket.js        # Socket.io connection
│   ├── usePollTimer.js     # Server-synced timer
│   └── usePollState.js     # Poll state management
│
├── context/         # React Context
│   └── PollContext.js      # Global state
│
├── utils/           # Utilities
│   ├── api.js              # HTTP client
│   └── uuid.js             # UUID generator
│
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles + Tailwind
```

## Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

**Production:**
```env
VITE_API_URL=https://your-backend.vercel.app
VITE_SOCKET_URL=https://your-backend.vercel.app
```

## Key Features

### State Management
- React Context API for global state
- Session storage for persistence
- Custom hooks for complex logic

### Real-time Updates
- Socket.io for bidirectional communication
- Auto-reconnection with state sync
- Live vote counts and results

### Responsive Design
- Tailwind responsive utilities
- Mobile-first approach
- Touch-friendly interactions

### Error Handling
- Error boundaries for crash recovery
- Toast notifications for feedback
- Loading states for async operations

## Routes

- `/` - Role selection
- `/student/name` - Student name entry
- `/student/view` - Student poll view (protected)
- `/teacher/dashboard` - Teacher dashboard (protected)
- `/teacher/history` - Poll history (protected)

## Configuration Files

### vite.config.js
```js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
});
```

### tailwind.config.js
Custom theme with project colors and utilities.

### postcss.config.js
PostCSS configuration for Tailwind processing.

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for auto-deployment.

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR - changes appear immediately without refresh.

### Tailwind IntelliSense
Install "Tailwind CSS IntelliSense" VS Code extension for autocomplete.

### React DevTools
Install React DevTools browser extension for debugging.

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.io Client](https://socket.io/docs/v4/client-api/)

## Common Issues

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Tailwind classes not working
```bash
# Rebuild Tailwind
npm run dev
```

### Environment variables not loading
- Ensure variables start with `VITE_`
- Restart dev server after changing `.env`

---

Built with Vite + React + Tailwind CSS
