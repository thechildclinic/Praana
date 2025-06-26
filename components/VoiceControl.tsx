
import React from 'react';
import { useVoice } from '../VoiceContext';

const MicrophoneIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zM7 11a5.002 5.002 0 004 4.9V19H9v2h6v-2h-2v-3.1A5.002 5.002 0 0017 11V5a5 5 0 00-10 0v6z" />
  </svg>
);

const VoiceControl: React.FC = () => {
  const { 
    isListening, 
    isSpeaking, 
    listeningState, 
    listen, 
    stopListening,
    permissionStatus,
    requestPermission,
    isSupported
  } = useVoice();

  const handleClick = () => {
    if (!isSupported) {
        alert("Voice control is not supported by your browser or microphone permission is denied.");
        return;
    }
    if (permissionStatus === 'prompt') {
      requestPermission();
      return;
    }
    if (permissionStatus === 'denied') {
        alert("Microphone permission was denied. Please enable it in your browser settings.");
        return;
    }

    if (isListening) {
      stopListening();
    } else {
      console.log("VoiceControl: Manual listen trigger (stages should manage this).");
      // Stages should typically handle listen calls with specific callbacks.
    }
  };
  
  let iconColor = "text-slate-500"; 
  let statusText = "Microphone";
  let bgColor = "bg-white/70 hover:bg-white";

  if (!isSupported || permissionStatus === 'denied') {
    iconColor = "text-red-500";
    statusText = "Microphone Not Available";
    bgColor = "bg-red-50 hover:bg-red-100";
  } else if (permissionStatus === 'prompt') {
    iconColor = "text-yellow-500";
    statusText = "Click to Enable Microphone";
    bgColor = "bg-yellow-50 hover:bg-yellow-100";
  } else if (isSpeaking) {
    iconColor = "text-blue-500 animate-pulse";
    statusText = "Shanti is Speaking";
    bgColor = "bg-blue-100";
  } else if (listeningState === 'listening') {
    iconColor = "text-green-500 animate-pulse";
    statusText = "Listening for your voice...";
    bgColor = "bg-green-100";
  } else if (listeningState === 'processing') {
    iconColor = "text-orange-500"; // orange-500 is a good medium
    statusText = "Processing audio...";
    bgColor = "bg-orange-50"; // Softer background
  } else if (listeningState === 'error') {
    iconColor = "text-red-500";
    statusText = "Microphone Error";
    bgColor = "bg-red-50";
  }


  return (
    <button
      onClick={handleClick}
      title={statusText}
      className={`p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-teal-700 focus:ring-sky-300 transition-colors duration-150 ease-in-out ${bgColor}`}
      aria-label={statusText}
      disabled={!isSupported && permissionStatus !== 'prompt'}
    >
      <MicrophoneIcon className={`w-5 h-5 ${iconColor}`} />
    </button>
  );
};

export default VoiceControl;