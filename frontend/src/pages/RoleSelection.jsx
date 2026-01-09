import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePollContext } from '../context/PollContext';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('student');
  const navigate = useNavigate();
  const { initializeUser } = usePollContext();

  const handleContinue = () => {
    if (selectedRole === 'student') {
      navigate('/student/name');
    } else {
      // Initialize teacher user
      initializeUser('Teacher', 'teacher');
      navigate('/teacher/dashboard');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-background">
      <div className="role-badge mb-8">
        <span className="text-base">✨</span>
        Intervue Poll
      </div>

      <h1 className="text-5xl text-black text-center mb-4">
        Welcome to the <span className="font-semibold text-black">Live Polling System</span> 
      </h1>
      <p className="text-base text-textSecondary text-center max-w-2xl mb-12 leading-relaxed">
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="flex gap-6 mb-12 flex-wrap justify-center">
        <div
          className={`card w-[360px] ${selectedRole === 'student' ? 'card-selected' : ''}`}
          onClick={() => setSelectedRole('student')}
        >
          <h2 className="text-2xl font-bold text-black mb-3">I'm a Student</h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry
          </p>
        </div>

        <div
          className={`card w-[360px] ${selectedRole === 'teacher' ? 'card-selected' : ''}`}
          onClick={() => setSelectedRole('teacher')}
        >
          <h2 className="text-2xl font-bold text-black mb-3">I'm a Teacher</h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            Submit answers and view live poll results in real-time.
          </p>
        </div>
      </div>

      <button className="btn-primary" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

export default RoleSelection;
