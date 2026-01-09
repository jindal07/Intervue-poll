import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePollContext } from '../context/PollContext';
import { usePollState } from '../hooks/usePollState';
import PollResults from '../components/PollResults';
import ChatButton from '../components/ChatButton';
import ChatPanel from '../components/ChatPanel';

// Simple UUID v4 generator
function v4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { currentPoll, pollResults, initializeUser, user } = usePollContext();
  const { createPoll } = usePollState();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [question, setQuestion] = useState('');
  const [duration, setDuration] = useState(60);
  const [options, setOptions] = useState([
    { id: v4(), text: '', isCorrect: true },
    { id: v4(), text: '', isCorrect: false }
  ]);

  // Initialize teacher user if not set
  React.useEffect(() => {
    if (!user) {
      initializeUser('Teacher', 'teacher');
    }
  }, [user, initializeUser]);

  const handleAddOption = () => {
    setOptions([...options, { id: v4(), text: '', isCorrect: false }]);
  };

  const handleOptionTextChange = (id, text) => {
    setOptions(options.map(opt => opt.id === id ? { ...opt, text } : opt));
  };

  const handleOptionCorrectChange = (id) => {
    setOptions(options.map(opt => ({ ...opt, isCorrect: opt.id === id })));
  };

  const handleCreatePoll = async () => {
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    const filledOptions = options.filter(opt => opt.text.trim());
    if (filledOptions.length < 2) {
      alert('Please provide at least 2 options');
      return;
    }

    setIsCreating(true);
    try {
      createPoll({
        question: question.trim(),
        options: filledOptions,
        duration
      });

      // Reset form
      setQuestion('');
      setOptions([
        { id: v4(), text: '', isCorrect: true },
        { id: v4(), text: '', isCorrect: false }
      ]);
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll');
    } finally {
      setIsCreating(false);
    }
  };

  // Show results if poll is active
  if (currentPoll) {
    return (
      <div className="min-h-screen bg-background px-6 py-12 relative">
        <button
          className="absolute top-8 right-8 text-white px-6 py-3 rounded-full text-sm font-semibold 
                     flex items-center gap-2 hover:opacity-90 hover:scale-105 transition-all btn-gradient"
          onClick={() => navigate('/teacher/history')}
        >
          <span className="text-base">👁</span>
          View Poll history
        </button>

        <div className="max-w-[1040px] mx-auto">
          <h2 className="text-4xl font-bold text-black mb-6">Question</h2>
          
          <div className="bg-[#5A5A5A] text-white px-8 py-6 rounded-t-2xl">
            <p className="text-lg font-medium leading-relaxed">{currentPoll.question}</p>
          </div>

          <PollResults
            question={currentPoll.question}
            results={pollResults}
            showWaitMessage={false}
          />

          <button
            className="btn-primary block mx-auto mt-8"
            onClick={() => window.location.reload()}
            disabled={currentPoll.status === 'active'}
          >
            + Ask a new question
          </button>
        </div>

        <ChatButton onClick={() => setIsChatOpen(true)} />
        {isChatOpen && (
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            role="teacher"
          />
        )}
      </div>
    );
  }

  // Show poll creation form
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="role-badge mb-8">
        <span className="text-base">✨</span>
        Intervue Poll
      </div>

      <div className="max-w-[960px] mx-auto">
        <h1 className="text-5xl font-bold text-black mb-4">Let's Get Started</h1>
        <p className="text-base text-textSecondary mb-12 leading-relaxed">
          you'll have the ability to create and manage polls, ask questions, and monitor
          your students' responses in real-time.
        </p>

        {/* Question Input */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <label className="text-base font-semibold text-black">
              Enter your question
            </label>
            <div className="relative">
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="appearance-none bg-white border border-textSecondary rounded-lg px-4 py-2 pr-10 text-sm text-textPrimary cursor-pointer"
              >
                {[...Array(60)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} second{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-xs pointer-events-none">
                ▼
              </span>
            </div>
          </div>

          <textarea
            className="w-full px-6 py-5 text-base text-textPrimary bg-white border border-textSecondary rounded-lg resize-vertical 
                       focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
            placeholder="Enter your question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
            rows={4}
          />
          <div className="text-right text-sm text-textSecondary mt-2">
            {question.length}/100
          </div>
        </div>

        {/* Options Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center pb-4 mb-6">
            <h3 className="text-lg font-semibold text-black">Edit Options</h3>
            <h3 className="text-lg font-semibold text-black mr-12">Is it Correct?</h3>
          </div>

          {options.map((option, index) => (
            <div key={option.id} className="flex justify-between items-center gap-6 mb-5">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full btn-gradient text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <input
                  type="text"
                  className="flex-1 px-4 py-3 text-base text-textPrimary bg-background border-0 rounded-lg 
                             focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={`Rahul Bajaj`}
                  value={option.text}
                  onChange={(e) => handleOptionTextChange(option.id, e.target.value)}
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={option.isCorrect}
                    onChange={() => handleOptionCorrectChange(option.id)}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-textPrimary font-medium">Yes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`correct-${option.id}`}
                    checked={!option.isCorrect}
                    onChange={() => {}}
                    className="w-5 h-5 cursor-pointer accent-primary"
                  />
                  <span className="text-sm text-textPrimary font-medium">No</span>
                </label>
              </div>
            </div>
          ))}

          <button
            className="bg-transparent text-primary border-2 border-primary px-6 py-3 rounded-lg text-base font-semibold 
                       hover:bg-primary/10 transition-all mt-4"
            onClick={handleAddOption}
          >
            + Add More option
          </button>
        </div>

        <button
          className="btn-primary block mx-auto"
          onClick={handleCreatePoll}
          disabled={isCreating}
        >
          {isCreating ? 'Creating...' : 'Ask Question'}
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
