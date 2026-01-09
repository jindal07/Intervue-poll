import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    // Connection handlers
    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionError(error.message);
    });

    socket.on('reconnect', () => {
      // Reconnected successfully
    });

    socket.on('reconnect_failed', () => {
      // Failed to reconnect
    });

    // Error handler
    socket.on('error', (data) => {
      console.error('Socket error:', data.message || 'An error occurred');
    });

    // Cleanup
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  // Emit event (memoized to prevent infinite loops)
  const emit = useCallback((event, data) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Listen to event (memoized)
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  }, []);

  // Remove listener (memoized)
  const off = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    emit,
    on,
    off
  };
};

