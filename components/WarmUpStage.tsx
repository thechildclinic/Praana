
import React, { useState, useEffect } from 'react';
import { SHANTI_MESSAGES, WARM_UP_STEPS, STAGE_DURATIONS } from '../constants';
import { SessionStage } from '../types';
import ShantiSpeaks from './ShantiSpeaks';

interface WarmUpStageProps {
  onComplete: () => void;
  speak?: (text: string, onEnd?: () => void) => void;
}

const WarmUpStage: React.FC<WarmUpStageProps> = ({ onComplete, speak }) => {
  const duration = STAGE_DURATIONS[SessionStage.WARM_UP];
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1); 
  const [currentShantiMessage, setCurrentShantiMessage] = useState(SHANTI_MESSAGES.warmUpIntro);
  const [introHasBeenSpoken, setIntroHasBeenSpoken] = useState(false);

  useEffect(() => {
    setCurrentShantiMessage(SHANTI_MESSAGES.warmUpIntro); 
    if (speak && !introHasBeenSpoken) {
      const introMsg = SHANTI_MESSAGES.warmUpIntro;
      speak(introMsg, () => {
        setIntroHasBeenSpoken(true);
      });
    }
  }, [speak, introHasBeenSpoken]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (introHasBeenSpoken) { 
         onComplete();
      } else {
        const introTimer = setTimeout(() => onComplete(), 1000); 
        return () => clearTimeout(introTimer);
      }
      return;
    }
    const timerId = setInterval(() => setTimeLeft((prevTime) => prevTime - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onComplete, introHasBeenSpoken]);

  useEffect(() => {
    if (!introHasBeenSpoken || timeLeft <= 0 || !WARM_UP_STEPS.length) {
      return;
    }

    const timePerStep = Math.max(1, Math.floor(duration / WARM_UP_STEPS.length));
    const newStepCalculated = Math.floor((duration - timeLeft) / timePerStep);
    const newStepIndex = Math.min(Math.max(0, newStepCalculated), WARM_UP_STEPS.length - 1);

    if (newStepIndex !== currentStepIndex) {
      const stepMessage = WARM_UP_STEPS[newStepIndex]; 
      setCurrentShantiMessage(stepMessage);
      if (speak) {
        speak(stepMessage);
      }
      setCurrentStepIndex(newStepIndex);
    }
  }, [timeLeft, duration, currentStepIndex, introHasBeenSpoken, speak]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto text-center">
      <ShantiSpeaks message={currentShantiMessage} />
      <div className="my-6 p-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">{SHANTI_MESSAGES.warmUpTitle}</h2>
        <div className="text-4xl font-bold text-emerald-600 mb-6">{formatTime(timeLeft)}</div>
        
        <div className="text-left space-y-3 prose prose-teal max-w-none">
          {WARM_UP_STEPS.map((step, index) => (
            <p key={index} className={`transition-all duration-500 ease-in-out p-2 rounded-md
              ${index === currentStepIndex ? 'opacity-100 font-semibold text-teal-700 bg-teal-50 scale-105 shadow-sm' : 'opacity-70 text-slate-600'}`}>
              <span className="mr-2 font-medium text-teal-500">{index + 1}.</span>{step}
            </p>
          ))}
        </div>
         <p className="mt-6 text-sm text-slate-500">Shanti is guiding you through each step. Follow her voice and the timer.</p>
      </div>
      <button
        onClick={onComplete}
        className="mt-4 px-6 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg shadow hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-colors duration-150"
      >
        {SHANTI_MESSAGES.warmUpSkipButton}
      </button>
    </div>
  );
};

export default WarmUpStage;
