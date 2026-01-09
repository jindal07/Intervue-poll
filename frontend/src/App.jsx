import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { PollProvider } from './context/PollContext';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

import RoleSelection from './pages/RoleSelection';
import StudentName from './pages/StudentName';
import StudentView from './pages/StudentView';
import TeacherDashboard from './pages/TeacherDashboard';
import PollHistory from './pages/PollHistory';

function App() {
  return (
    <ErrorBoundary>
      <PollProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RoleSelection />} />
            
            {/* Student Routes */}
            <Route path="/student/name" element={<StudentName />} />
            <Route
              path="/student/view"
              element={
                <ProtectedRoute role="student">
                  <StudentView />
                </ProtectedRoute>
              }
            />

            {/* Teacher Routes */}
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute role="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/history"
              element={
                <ProtectedRoute role="teacher">
                  <PollHistory />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PollProvider>
    </ErrorBoundary>
  );
}

export default App;
