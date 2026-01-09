const pollService = require('../services/poll.service');
const voteService = require('../services/vote.service');
const participantService = require('../services/participant.service');
const chatService = require('../services/chat.service');

class PollSocket {
  constructor(io) {
    this.io = io;
    this.activePollTimers = new Map();
  }

  initialize() {
    this.io.on('connection', (socket) => {

      // Join main room
      socket.join('polling-room');

      // Student joins
      socket.on('student:join', async (data) => {
        try {
          const { name, studentId } = data;
          await participantService.addParticipant({
            name,
            socketId: socket.id
          });

          // Broadcast to all clients
          const participants = await participantService.getParticipants();
          this.io.to('polling-room').emit('participants:updated', participants);

          // Send current state to the joining student
          const activePoll = await pollService.getActivePoll();
          if (activePoll) {
            const hasVoted = await voteService.hasStudentVoted(activePoll.id, studentId);
            socket.emit('state:sync', {
              poll: activePoll,
              hasVoted
            });
          } else {
            socket.emit('state:sync', { poll: null, hasVoted: false });
          }

          // Send chat history
          const messages = await chatService.getRecentMessages();
          socket.emit('chat:history', messages);
        } catch (error) {
          console.error('Error on student join:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Teacher joins
      socket.on('teacher:join', async () => {
        try {
          // Send current state
          const activePoll = await pollService.getActivePoll();
          const participants = await participantService.getParticipants();
          const messages = await chatService.getRecentMessages();

          socket.emit('state:sync', {
            poll: activePoll,
            participants,
            messages
          });
        } catch (error) {
          console.error('Error on teacher join:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Create poll
      socket.on('poll:create', async (data) => {
        try {
          const poll = await pollService.createPoll(data);
          
          // Broadcast to all clients
          this.io.to('polling-room').emit('poll:created', poll);

          // Set up auto-complete timer
          this.setupPollTimer(poll);
        } catch (error) {
          console.error('Error creating poll:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Submit vote
      socket.on('vote:submit', async (data) => {
        try {
          const vote = await voteService.submitVote(data);
          
          // Acknowledge to sender
          socket.emit('vote:submitted', { success: true, vote });

          // Get updated results and broadcast
          const results = await pollService.getPollResults(data.pollId);
          this.io.to('polling-room').emit('poll:updated', results);
        } catch (error) {
          console.error('Error submitting vote:', error);
          socket.emit('vote:error', { message: error.message });
        }
      });

      // Chat message
      socket.on('chat:send', async (data) => {
        try {
          const message = await chatService.sendMessage(data);
          
          // Broadcast to all clients
          this.io.to('polling-room').emit('chat:message', message);
        } catch (error) {
          console.error('Error sending chat message:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Kick participant
      socket.on('participant:kick', async (data) => {
        try {
          const { participantId } = data;
          const participant = await participantService.kickParticipant(participantId);

          // Notify the kicked participant
          const sockets = await this.io.in('polling-room').fetchSockets();
          const targetSocket = sockets.find(s => s.id === participant.socketId);
          if (targetSocket) {
            targetSocket.emit('participant:kicked');
            targetSocket.disconnect(true);
          }

          // Update participant list for everyone
          const participants = await participantService.getParticipants();
          this.io.to('polling-room').emit('participants:updated', participants);
        } catch (error) {
          console.error('Error kicking participant:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Request state sync (for reconnections)
      socket.on('state:request', async (data) => {
        try {
          const { role, studentId } = data;
          const activePoll = await pollService.getActivePoll();
          const participants = await participantService.getParticipants();
          const messages = await chatService.getRecentMessages();

          if (role === 'student' && studentId && activePoll) {
            const hasVoted = await voteService.hasStudentVoted(activePoll.id, studentId);
            socket.emit('state:sync', {
              poll: activePoll,
              hasVoted,
              participants,
              messages
            });
          } else {
            socket.emit('state:sync', {
              poll: activePoll,
              participants,
              messages
            });
          }
        } catch (error) {
          console.error('Error syncing state:', error);
          socket.emit('error', { message: error.message });
        }
      });

      // Disconnect
      socket.on('disconnect', async () => {
        try {
          // Remove participant if student
          await participantService.removeParticipant(socket.id);
          
          // Update participant list
          const participants = await participantService.getParticipants();
          this.io.to('polling-room').emit('participants:updated', participants);
        } catch (error) {
          console.error('Error on disconnect:', error);
        }
      });
    });
  }

  setupPollTimer(poll) {
    // Clear any existing timer for this poll
    if (this.activePollTimers.has(poll.id)) {
      clearTimeout(this.activePollTimers.get(poll.id));
    }

    // Calculate time until poll expires
    const durationMs = poll.duration * 1000;
    const startTime = typeof poll.startTime === 'string' ? parseInt(poll.startTime) : poll.startTime;
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, durationMs - elapsed);

    // Set timer to auto-complete poll
    const timer = setTimeout(async () => {
      try {
        await pollService.completePoll(poll.id);
        const results = await pollService.getPollResults(poll.id);
        
        // Notify all clients
        this.io.to('polling-room').emit('poll:completed', {
          pollId: poll.id,
          results
        });

        this.activePollTimers.delete(poll.id);
      } catch (error) {
        console.error('Error auto-completing poll:', error);
      }
    }, remaining);

    this.activePollTimers.set(poll.id, timer);
  }

  // Broadcast poll update manually (can be called from services)
  async broadcastPollUpdate(pollId) {
    try {
      const results = await pollService.getPollResults(pollId);
      this.io.to('polling-room').emit('poll:updated', results);
    } catch (error) {
      console.error('Error broadcasting poll update:', error);
    }
  }
}

module.exports = PollSocket;

