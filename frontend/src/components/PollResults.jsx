import React from 'react';

const PollResults = ({ question, results, showWaitMessage = false }) => {
  if (!results) {
    return (
      <div className="text-center py-12 text-lg text-textSecondary">
        Loading results...
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#E0E0E0] rounded-b-2xl p-6 space-y-5">
      {results.results?.map((result, index) => (
        <div key={result.optionId} className="flex items-center gap-4">
          {/* Progress bar container */}
          <div className="flex-1 flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
              {index + 1}
            </div>
            <div className="flex-1 h-12 bg-background rounded-lg overflow-hidden relative">
              {/* Colored progress bar - only visible if percentage > 0 */}
              {result.percentage > 0 && (
                <div
                  className="h-full bg-secondary transition-all duration-500 ease-out absolute top-0 left-0"
                  style={{ width: `${result.percentage}%` }}
                />
              )}
              {/* Option text - always visible */}
              <div className="relative h-full flex items-center px-4">
                <span className={`font-medium text-sm whitespace-nowrap ${result.percentage > 0 ? 'text-white' : 'text-textSecondary'}`}>
                  {result.optionText}
                </span>
              </div>
            </div>
          </div>
          {/* Percentage */}
          <span className="text-lg font-bold text-black w-14 text-right">
            {result.percentage}%
          </span>
        </div>
      ))}

      {showWaitMessage && (
        <p className="text-center text-2xl font-semibold text-black mt-8 pt-8 border-t border-background">
          Wait for the teacher to ask a new question..
        </p>
      )}
    </div>
  );
};

export default PollResults;
