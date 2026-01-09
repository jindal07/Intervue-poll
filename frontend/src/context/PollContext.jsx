import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const PollContext = createContext();

export const usePollContext = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePollContext must be used within PollProvider');
  }
  return context;
};

export const PollProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem('poll_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [role, setRole] = useState(() => {
    return sessionStorage.getItem('poll_role') || null;
  });

  // Poll state
  const [currentPoll, setCurrentPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Participants and chat
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // UI state
  const [isKicked, setIsKicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Save user to session storage
  useEffect(() => {
    if (user) {
      sessionStorage.setItem('poll_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('poll_user');
    }
  }, [user]);

  // Save role to session storage
  useEffect(() => {
    if (role) {
      sessionStorage.setItem('poll_role', role);
    } else {
      sessionStorage.removeItem('poll_role');
    }
  }, [role]);

  // Initialize user
  const initializeUser = useCallback((name, userRole) => {
    const studentId = v4();
    const newUser = {
      id: studentId,
      name,
      role: userRole
    };
    setUser(newUser);
    setRole(userRole);
    return newUser;
  }, []);

  // Update poll
  const updatePoll = useCallback((poll) => {
    setCurrentPoll(poll);
  }, []);

  // Update results
  const updateResults = useCallback((results) => {
    setPollResults(results);
  }, []);

  // Add participant
  const addParticipant = useCallback((participant) => {
    setParticipants((prev) => {
      const exists = prev.find((p) => p.id === participant.id);
      if (exists) return prev;
      return [...prev, participant];
    });
  }, []);

  // Update participants list
  const updateParticipants = useCallback((newParticipants) => {
    setParticipants(newParticipants);
  }, []);

  // Remove participant
  const removeParticipant = useCallback((participantId) => {
    setParticipants((prev) => prev.filter((p) => p.id !== participantId));
  }, []);

  // Add chat message
  const addChatMessage = useCallback((message) => {
    setChatMessages((prev) => [...prev, message]);
  }, []);

  // Set chat history
  const setChatHistory = useCallback((messages) => {
    setChatMessages(messages);
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setCurrentPoll(null);
    setPollResults(null);
    setHasVoted(false);
    setSelectedOption(null);
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setCurrentPoll(null);
    setPollResults(null);
    setHasVoted(false);
    setSelectedOption(null);
    setParticipants([]);
    setChatMessages([]);
    setIsKicked(false);
    sessionStorage.clear();
  }, []);

  const value = {
    // User
    user,
    role,
    initializeUser,
    logout,

    // Poll
    currentPoll,
    updatePoll,
    pollResults,
    updateResults,
    hasVoted,
    setHasVoted,
    selectedOption,
    setSelectedOption,
    resetState,

    // Participants
    participants,
    addParticipant,
    updateParticipants,
    removeParticipant,

    // Chat
    chatMessages,
    addChatMessage,
    setChatHistory,

    // UI
    isKicked,
    setIsKicked,
    isLoading,
    setIsLoading
  };

  return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
};
