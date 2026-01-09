import React from 'react';

const KickedOut = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-background">
      <div className="role-badge mb-8">
        <span className="text-base">✨</span>
        Intervue Poll
      </div>

      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-black mb-6">
          You've been Kicked out !
        </h1>
        <p className="text-lg text-textSecondary leading-relaxed">
          Looks like the teacher had removed you from the poll system .Please Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default KickedOut;
