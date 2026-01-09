import React from 'react';

const PollOptions = ({ options, selectedOption, onSelect, disabled = false }) => {
  const handleClick = (optionId) => {
    if (!disabled && onSelect) {
      onSelect(optionId);
    }
  };

  if (!options || !Array.isArray(options)) {
    return <div className="text-red-500 p-4">Error: Invalid poll options</div>;
  }

  return (
    <div className="bg-white border-2 border-[#E0E0E0] rounded-b-2xl p-6 space-y-3">
      {options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          className={`w-full flex items-center gap-4 px-6 py-5 rounded-xl transition-all duration-200
            ${selectedOption === option.id 
              ? 'bg-white border-[3px] border-primary' 
              : 'bg-background border-2 border-transparent hover:border-textSecondary'
            }
            ${disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:scale-[1.01]'}
          `}
          onClick={() => handleClick(option.id)}
          disabled={disabled}
        >
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
            ${selectedOption === option.id ? 'btn-gradient text-white' : 'bg-textSecondary text-white'}
          `}>
            {index + 1}
          </div>
          <span className="text-base font-medium flex-1 text-left text-black">{option.text}</span>
        </button>
      ))}
    </div>
  );
};

export default PollOptions;
