import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePollContext } from '../context/PollContext';

const StudentName = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { initializeUser } = usePollContext();

  const handleContinue = () => {
    if (name.trim()) {
      initializeUser(name.trim(), 'student');
      navigate('/student/view');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && name.trim()) {
      handleContinue();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-background">
      <div className="role-badge mb-8">
        <span className="text-base">✨</span>
        Intervue Poll
      </div>

      <h1 className="text-5xl text-black text-center mb-4">
        Let's <span className="font-semibold text-black">Get Started</span>
      </h1>
      <p className="text-base text-textSecondary text-center max-w-2xl mb-12 leading-relaxed">
        If you're a student, you'll be able to <strong className="font-bold text-black">submit your answers</strong>,
        participate in live polls, and see how your responses compare with your classmates
      </p>

      <div className="w-full max-w-[500px] mb-12">
        <label className="block text-base font-semibold text-black mb-3">
          Enter your Name
        </label>
        <input
          type="text"
          className="input-field"
          placeholder="Rahul Bajaj"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleContinue}
        disabled={!name.trim()}
      >
        Continue
      </button>
    </div>
  );
};

export default StudentName;
