import { useEffect, useCallback } from 'react';
import { usePollContext } from '../context/PollContext';
import { useSocket } from './useSocket';
import { pollAPI, voteAPI } from '../utils/api';

export const usePollState = () => {
  const {
    user,
    role,
    currentPoll,
    updatePoll,
    updateResults,
    hasVoted,
    setHasVoted,
    updateParticipants,
    addChatMessage,
    setChatHistory,
    setIsKicked,
    resetState
  } = usePollContext();

  const { socket, isConnected, emit, on, off } = useSocket();

  // Fetch active poll on mount
  useEffect(() => {
    const fetchActivePoll = async () => {
      try {
        const response = await pollAPI.getActivePoll();
        if (response.data) {
          updatePoll(response.data);
          if (response.data.results) {
            updateResults(response.data.results);
          }

          // Check if student has voted
          if (role === 'student' && user) {
            const voteCheck = await voteAPI.checkIfVoted(response.data.id, user.id);
            setHasVoted(voteCheck.data.hasVoted);
          }
        }
      } catch (error) {
        console.error('Error fetching active poll:', error);
      }
    };

    if (role) {
      fetchActivePoll();
    }
  }, [role, user, updatePoll, updateResults, setHasVoted]);

  // Join room when connected
  useEffect(() => {
    if (!isConnected || !socket || !role) return;

    if (role === 'student' && user) {
      emit('student:join', { name: user.name, studentId: user.id });
    } else if (role === 'teacher') {
      emit('teacher:join');
    }
  }, [isConnected, socket, role, user, emit]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // State sync
    const handleStateSync = (data) => {
      if (data.poll) {
        updatePoll(data.poll);
        if (data.poll.results) {
          updateResults(data.poll.results);
        }
      } else {
        resetState();
      }

      if (data.hasVoted !== undefined) {
        setHasVoted(data.hasVoted);
      }

      if (data.participants) {
        updateParticipants(data.participants);
      }

      if (data.messages) {
        setChatHistory(data.messages);
      }
    };

    // Poll created
    const handlePollCreated = (poll) => {
      updatePoll(poll);
      setHasVoted(false); // Reset vote status for new poll
    };

    // Poll updated
    const handlePollUpdated = (results) => {
      updateResults(results);
    };

    // Poll completed
    const handlePollCompleted = (data) => {
      updatePoll((prev) => {
        if (prev && prev.id === data.pollId) {
          return { ...prev, status: 'completed' };
        }
        return prev;
      });
      updateResults(data.results);
    };

    // Vote submitted
    const handleVoteSubmitted = () => {
      setHasVoted(true);
    };

    // Vote error
    const handleVoteError = (data) => {
      console.error('Vote error:', data.message || 'Failed to submit vote');
    };

    // Participants updated
    const handleParticipantsUpdated = (participants) => {
      updateParticipants(participants);
    };

    // Chat message
    const handleChatMessage = (message) => {
      addChatMessage(message);
    };

    // Chat history
    const handleChatHistory = (messages) => {
      setChatHistory(messages);
    };

    // Kicked
    const handleKicked = () => {
      setIsKicked(true);
    };

    // Register listeners
    on('state:sync', handleStateSync);
    on('poll:created', handlePollCreated);
    on('poll:updated', handlePollUpdated);
    on('poll:completed', handlePollCompleted);
    on('vote:submitted', handleVoteSubmitted);
    on('vote:error', handleVoteError);
    on('participants:updated', handleParticipantsUpdated);
    on('chat:message', handleChatMessage);
    on('chat:history', handleChatHistory);
    on('participant:kicked', handleKicked);

    // Cleanup
    return () => {
      off('state:sync', handleStateSync);
      off('poll:created', handlePollCreated);
      off('poll:updated', handlePollUpdated);
      off('poll:completed', handlePollCompleted);
      off('vote:submitted', handleVoteSubmitted);
      off('vote:error', handleVoteError);
      off('participants:updated', handleParticipantsUpdated);
      off('chat:message', handleChatMessage);
      off('chat:history', handleChatHistory);
      off('participant:kicked', handleKicked);
    };
  }, [
    socket,
    on,
    off,
    updatePoll,
    updateResults,
    setHasVoted,
    updateParticipants,
    addChatMessage,
    setChatHistory,
    setIsKicked,
    resetState
  ]);

  // Create poll
  const createPoll = useCallback((pollData) => {
    emit('poll:create', pollData);
  }, [emit]);

  // Submit vote
  const submitVote = useCallback((voteData) => {
    emit('vote:submit', voteData);
  }, [emit]);

  // Send chat message
  const sendChatMessage = useCallback((message) => {
    emit('chat:send', message);
  }, [emit]);

  // Kick participant
  const kickParticipant = useCallback((participantId) => {
    emit('participant:kick', { participantId });
  }, [emit]);

  // Request state sync
  const requestStateSync = useCallback(() => {
    if (role && user) {
      emit('state:request', { role, studentId: user.id });
    }
  }, [emit, role, user]);

  return {
    isConnected,
    currentPoll,
    hasVoted,
    createPoll,
    submitVote,
    sendChatMessage,
    kickParticipant,
    requestStateSync
  };
};

