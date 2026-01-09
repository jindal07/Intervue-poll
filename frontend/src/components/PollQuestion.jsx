import React from 'react';

const PollQuestion = ({ questionNumber, question, timer, showTimer = true }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-6">
        <span className="text-2xl font-bold text-black">
          Question {questionNumber}
        </span>
        {showTimer && (
          <span className="text-2xl font-bold text-red-500 flex items-center gap-2">
            ⏱ {timer}
          </span>
        )}
      </div>

      <div className="bg-[#5A5A5A] text-white px-8 py-6 rounded-t-2xl">
        <p className="text-lg font-medium leading-relaxed">{question}</p>
      </div>
    </div>
  );
};

export default PollQuestion;
