import React, { useState } from 'react';
import { usePollContext } from '../context/PollContext';
import { usePollState } from '../hooks/usePollState';
import { usePollTimer } from '../hooks/usePollTimer';
import PollQuestion from '../components/PollQuestion';
import PollOptions from '../components/PollOptions';
import PollResults from '../components/PollResults';
import ChatButton from '../components/ChatButton';
import ChatPanel from '../components/ChatPanel';
import KickedOut from '../components/KickedOut';

const StudentView = () => {
  const {
    user,
    currentPoll,
    pollResults,
    hasVoted,
    selectedOption,
    setSelectedOption,
    isKicked
  } = usePollContext();

  const { submitVote } = usePollState();
  const { formattedTime, isExpired } = usePollTimer(currentPoll);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isKicked) {
    return <KickedOut />;
  }

  // Waiting state - no active poll
  if (!currentPoll || currentPoll.status !== 'active') {
    return (
      <div className="min-h-screen bg-background px-6 py-12 relative">
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
          <div className="role-badge mb-4">
            <span className="text-base">✨</span>
            Intervue Poll
          </div>
          <div className="spinner"></div>
          <p className="text-3xl font-semibold text-black text-center">
            Wait for the teacher to ask questions..
          </p>
        </div>

        <ChatButton onClick={() => setIsChatOpen(true)} />
        {isChatOpen && (
          <ChatPanel
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            role="student"
          />
        )}
      </div>
    );
  }

  // Show results if voted or poll expired
  const showResults = hasVoted || isExpired || currentPoll.status === 'completed';

  const handleSubmit = async () => {
    if (!selectedOption || hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitVote({
        pollId: currentPoll.id,
        studentId: user.id,
        optionId: selectedOption
      });
    } catch (error) {
      console.error('Error submitting vote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12 relative">
      <div className="max-w-[1040px] mx-auto">
        {!showResults ? (
          <>
            <PollQuestion
              questionNumber={1}
              question={currentPoll.question}
              timer={formattedTime}
              showTimer={!isExpired}
            />
            <PollOptions
              options={currentPoll.options}
              selectedOption={selectedOption}
              onSelect={setSelectedOption}
              disabled={hasVoted || isExpired}
            />

            <button
              className="btn-primary block mx-auto mt-8"
              onClick={handleSubmit}
              disabled={!selectedOption || hasVoted || isSubmitting || isExpired}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </>
        ) : (
          <>
            <PollQuestion
              questionNumber={1}
              question={currentPoll.question}
              timer={formattedTime}
              showTimer={false}
            />
            <PollResults
              question={currentPoll.question}
              results={pollResults}
              showWaitMessage={true}
            />
          </>
        )}
      </div>

      <ChatButton onClick={() => setIsChatOpen(true)} />
      {isChatOpen && (
        <ChatPanel
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          role="student"
        />
      )}
    </div>
  );
};

export default StudentView;
