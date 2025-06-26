import React from 'react';
import BrainIcon from './icons/BrainIcon'; 

interface ShantiSpeaksProps {
  message: string;
  avatar?: boolean; 
}

const ShantiSpeaks: React.FC<ShantiSpeaksProps> = ({ message, avatar = true }) => {
  return (
    <div className="flex items-start space-x-3 my-4 p-4 bg-[var(--theme-bg-shanti-speaks)] rounded-xl shadow-sm border border-[var(--theme-border-shanti-speaks)]">
      {avatar && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--theme-bg-shanti-avatar)] flex items-center justify-center text-[var(--theme-text-on-shanti-avatar)] p-1.5 shadow-inner">
          <BrainIcon className="w-full h-full text-[var(--theme-text-on-shanti-avatar)]" />
        </div>
      )}
      <div className="flex-1">
        <p 
            className="text-[var(--theme-text-body)] leading-relaxed text-sm md:text-base" 
            style={{ fontFamily: "'Lora', serif" }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};

export default ShantiSpeaks;