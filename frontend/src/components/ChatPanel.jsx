import React, { useState, useRef, useEffect } from 'react';
import { usePollContext } from '../context/PollContext';
import { usePollState } from '../hooks/usePollState';
import ParticipantsPanel from './ParticipantsPanel';

const ChatPanel = ({ isOpen, onClose, role }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const { chatMessages, user } = usePollContext();
  const { sendChatMessage } = usePollState();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && user) {
      sendChatMessage({
        senderName: user.name,
        message: message.trim()
      });
      setMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 z-[1000]" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="fixed top-0 right-0 w-[400px] h-screen bg-white shadow-2xl z-[1001] flex flex-col animate-slideIn">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b-2 border-background">
          <div className="flex gap-8">
            <button
              className={`pb-2 px-0 text-base font-semibold border-b-[3px] transition-all
                ${activeTab === 'chat' 
                  ? 'text-primary border-primary' 
                  : 'text-textSecondary border-transparent'
                }`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
            <button
              className={`pb-2 px-0 text-base font-semibold border-b-[3px] transition-all
                ${activeTab === 'participants' 
                  ? 'text-primary border-primary' 
                  : 'text-textSecondary border-transparent'
                }`}
              onClick={() => setActiveTab('participants')}
            >
              Participants
            </button>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center text-2xl text-textSecondary hover:text-textPrimary transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
              {chatMessages.length === 0 ? (
                <p className="text-center text-textSecondary py-12">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                chatMessages.map((msg, index) => {
                  const isOwnMessage = user && msg.senderName === user.name;
                  return (
                    <div
                      key={index}
                      className={`flex flex-col gap-1 ${isOwnMessage ? 'items-end' : 'items-start'}`}
                    >
                      <span className={`text-xs font-semibold ${isOwnMessage ? 'text-secondary' : 'text-primary'}`}>
                        {msg.senderName}
                      </span>
                      <div
                        className={`max-w-[80%] px-4 py-3 rounded-xl text-sm leading-relaxed break-words
                          ${isOwnMessage 
                            ? 'btn-gradient text-white rounded-br-sm' 
                            : 'bg-textPrimary text-white rounded-bl-sm'
                          }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              className="px-6 py-4 border-t border-background flex gap-3"
              onSubmit={handleSendMessage}
            >
              <input
                type="text"
                className="flex-1 px-4 py-3 border border-textSecondary rounded-full text-sm 
                           focus:outline-none focus:border-primary"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                type="submit"
                className="btn-gradient text-white px-6 py-3 rounded-full text-sm font-semibold 
                           hover:opacity-90 hover:scale-105 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                style={!message.trim() ? {background: '#6E6E6E'} : {}}
                disabled={!message.trim()}
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <ParticipantsPanel role={role} />
        )}
      </div>
    </>
  );
};

export default ChatPanel;
