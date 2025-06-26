import React from 'react';

const RiverFlowIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 100 100" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className || "w-full h-full"}
    aria-hidden="true"
  >
    <path d="M20 30 Q35 20, 50 30 T80 30" />
    <path d="M20 50 Q35 40, 50 50 T80 50" />
    <path d="M20 70 Q35 60, 50 70 T80 70" />
  </svg>
);

export default RiverFlowIcon;
