import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pollAPI } from '../utils/api';

const PollHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await pollAPI.getPollHistory();
        setHistory(response.data || []);
      } catch (error) {
        console.error('Error fetching poll history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-6 py-12 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="max-w-[1040px] mx-auto">
        <div className="flex items-center gap-6 mb-12">
          <button
            className="text-white px-6 py-3 rounded-full text-sm font-semibold 
                       hover:opacity-90 hover:scale-105 transition-all btn-gradient"
            onClick={() => navigate('/teacher/dashboard')}
          >
            ← Back
          </button>
          <h1 className="text-5xl font-bold text-black">View Poll History</h1>
        </div>

        <div className="space-y-12">
          {history.length === 0 ? (
            <p className="text-center text-2xl text-textSecondary py-12">
              No polls conducted yet.
            </p>
          ) : (
            history.map((poll, index) => (
              <div key={poll.id}>
                <h2 className="text-2xl font-bold text-black mb-4">
                  Question {index + 1}
                </h2>
                
                <div className="bg-[#5A5A5A] text-white px-8 py-6 rounded-t-2xl">
                  <p className="text-lg font-medium leading-relaxed">{poll.question}</p>
                </div>

                <div className="bg-white border-2 border-[#E0E0E0] rounded-b-2xl p-6 space-y-5">
                  {poll.results?.results?.map((result, idx) => (
                    <div key={result.optionId} className="flex items-center gap-4">
                      <div className="flex-1 flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex-1 h-12 bg-background rounded-lg overflow-hidden relative">
                          <div
                            className="h-full bg-secondary transition-all duration-500 ease-out flex items-center px-4"
                            style={{ width: `${result.percentage}%` }}
                          >
                            <span className="text-white font-medium text-sm whitespace-nowrap">{result.optionText}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-black w-14 text-right">
                        {result.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;
