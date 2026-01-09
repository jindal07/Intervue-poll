import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePollContext } from '../context/PollContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, role: userRole } = usePollContext();

  // Check if user exists and role matches
  if (!user || !userRole) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

