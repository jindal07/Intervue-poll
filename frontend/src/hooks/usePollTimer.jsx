import { useState, useEffect, useRef } from 'react';

export const usePollTimer = (poll) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!poll || poll.status !== 'active') {
      setRemainingTime(0);
      setIsExpired(true);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    // Calculate initial remaining time from server
    const calculateRemainingTime = () => {
      const startTime = typeof poll.startTime === 'string' ? parseInt(poll.startTime) : poll.startTime;
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, poll.duration - elapsed);
      return remaining;
    };

    // Set initial time
    const initial = calculateRemainingTime();
    setRemainingTime(initial);
    setIsExpired(initial === 0);

    // Update every second
    intervalRef.current = setInterval(() => {
      const remaining = calculateRemainingTime();
      setRemainingTime(remaining);

      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(intervalRef.current);
      }
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [poll]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    remainingTime,
    formattedTime: formatTime(remainingTime),
    isExpired
  };
};

