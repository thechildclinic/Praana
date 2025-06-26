
import React, { useState, useEffect } from 'react';
import { SHANTI_MESSAGES, COOL_DOWN_STEPS, STAGE_DURATIONS } from '../constants';
import { SessionStage } from '../types';
import ShantiSpeaks from './ShantiSpeaks';

interface CoolDownStageProps {
  onComplete: () => void;
  speak?: (text: string, onEnd?: () => void) => void;
}

const CoolDownStage: React.FC<CoolDownStageProps> = ({ onComplete, speak }) => {
  const duration = STAGE_DURATIONS[SessionStage.COOL_DOWN];
  const [timeLeft, setTimeLeft] = useState(duration);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [currentShantiMessage, setCurrentShantiMessage] = useState(SHANTI_MESSAGES.coolDownIntro);
  const [introHasBeenSpoken, setIntroHasBeenSpoken] = useState(false);

  useEffect(() => {
    setCurrentShantiMessage(SHANTI_MESSAGES.coolDownIntro);
    if (speak && !introHasBeenSpoken) {
      const introMsg = SHANTI_MESSAGES.coolDownIntro;
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
    if (!introHasBeenSpoken || timeLeft <= 0 || !COOL_DOWN_STEPS.length) {
      return;
    }

    const timePerStep = Math.max(1, Math.floor(duration / COOL_DOWN_STEPS.length));
    const newStepCalculated = Math.floor((duration - timeLeft) / timePerStep);
    const newStepIndex = Math.min(Math.max(0, newStepCalculated), COOL_DOWN_STEPS.length - 1);

    if (newStepIndex !== currentStepIndex) {
      const stepMessage = COOL_DOWN_STEPS[newStepIndex];
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
        <h2 className="text-2xl font-semibold text-teal-700 mb-4">{SHANTI_MESSAGES.coolDownTitle}</h2>
        <div className="text-4xl font-bold text-emerald-600 mb-6">{formatTime(timeLeft)}</div>
        
        <div className="text-left space-y-3 prose prose-teal max-w-none">
          {COOL_DOWN_STEPS.map((step, index) => (
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
        className="mt-4 px-8 py-3 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150 ease-in-out"
      >
        {SHANTI_MESSAGES.coolDownFinishButton}
      </button>
    </div>
  );
};

export default CoolDownStage;
