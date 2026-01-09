import React from 'react';
import { usePollContext } from '../context/PollContext';
import { usePollState } from '../hooks/usePollState';

const ParticipantsPanel = ({ role }) => {
  const { participants } = usePollContext();
  const { kickParticipant } = usePollState();

  const handleKick = (participantId) => {
    if (window.confirm('Are you sure you want to kick this student?')) {
      kickParticipant(participantId);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {role === 'teacher' && (
        <div className="flex justify-between px-6 py-4 border-b border-background bg-background">
          <span className="text-sm font-semibold text-textSecondary">Name</span>
          <span className="text-sm font-semibold text-textSecondary">Action</span>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 py-4">
        {participants.length === 0 ? (
          <p className="text-center text-textSecondary py-12">No participants yet.</p>
        ) : (
          participants.map((participant) => (
            <div
              key={participant.id}
              className="flex justify-between items-center py-3 border-b border-background last:border-b-0"
            >
              <span className="text-sm text-textPrimary font-medium">{participant.name}</span>
              {role === 'teacher' && (
                <button
                  className="text-sm font-semibold text-primary underline hover:text-secondary transition-colors"
                  onClick={() => handleKick(participant.id)}
                >
                  Kick out
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ParticipantsPanel;
