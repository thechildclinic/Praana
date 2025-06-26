import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PranayamaTechnique, TechniquePhase, ExperienceLevel, UserProfile } from '../types';
import BreathingAnimator from './BreathingAnimator';
import ShantiSpeaks from './ShantiSpeaks';
import { SHANTI_MESSAGES } from '../constants';

interface PranayamaTechniquePlayerProps {
  technique: PranayamaTechnique;
  experienceLevel: ExperienceLevel;
  userProfile: UserProfile;
  onComplete: (completedNormally: boolean) => void;
  onIssueReported: (issue: string) => void;
  speak: (text: string, onEnd?: () => void) => void;
  listen: (
    onResult: (transcript: string) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void,
    options?: { continuous?: boolean, interimResults?: boolean }
  ) => void;
  stopListening: () => void;
  cancelSpeech: () => void;
  isSpeaking: boolean;
  isListening: boolean;
  onScreenTap?: () => void;
}

const PranayamaTechniquePlayer: React.FC<PranayamaTechniquePlayerProps> = ({
    technique, experienceLevel, userProfile,
    onComplete, onIssueReported,
    speak, listen, stopListening, cancelSpeech,
    isSpeaking, isListening: isListeningValue,
    onScreenTap
}) => {
  const totalRounds = technique.rounds[experienceLevel] || 1;
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(-1);
  const [currentPhaseTimer, setCurrentPhaseTimer] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showInitialInstruction, setShowInitialInstruction] = useState(true);
  const [shantiSays, setShantiSays] = useState("");
  const [hasInformedCommands, setHasInformedCommands] = useState(false);

  const currentPhaseRef = useRef<TechniquePhase | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const inhaleSoundRef = useRef<HTMLAudioElement | null>(null);
  const exhaleSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    
    const inhaleAudio = document.getElementById('inhale-sound-player') as HTMLAudioElement;
    if (inhaleAudio) {
        inhaleSoundRef.current = inhaleAudio;
        inhaleSoundRef.current.src = "/assets/audio/breath-inhale.mp3"; 
    }
    const exhaleAudio = document.getElementById('exhale-sound-player') as HTMLAudioElement;
    if (exhaleAudio) {
        exhaleSoundRef.current = exhaleAudio;
        exhaleSoundRef.current.src = "/assets/audio/breath-exhale.mp3";
    }


    if (showInitialInstruction) {
        let fullInstructionText = technique.initialInstruction;
        if (technique.benefits && technique.benefits.length > 0) {
            const benefitsSummary = SHANTI_MESSAGES.spokenBenefitsIntro +
                                   technique.benefits.slice(0, 3).join(', ') +
                                   (technique.benefits.length > 3 ? SHANTI_MESSAGES.spokenBenefitsContinuation + 'others' : '') +
                                   SHANTI_MESSAGES.spokenBenefitsEnd;
            fullInstructionText += " " + benefitsSummary;
        }
        fullInstructionText += " You can gently close your eyes now if you're comfortable, and follow my voice and the subtle breath sounds for guidance. Using voice commands will allow for a fully hands-free experience.";
        setShantiSays(fullInstructionText);
        setTimeout(() => {
            if (isMountedRef.current && speak && !isSpeaking && showInitialInstruction) {
                 speak(fullInstructionText);
            }
        }, 150);
    }

    return () => {
      isMountedRef.current = false;
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
      inhaleSoundRef.current?.pause();
      exhaleSoundRef.current?.pause();
    };
  }, []);


  const playBreathSound = (type: 'inhale' | 'exhale' | 'hum') => {
    if (isPaused || showInitialInstruction) return;
    const soundToPlay = (type === 'inhale') ? inhaleSoundRef.current : exhaleSoundRef.current;
    if (soundToPlay) {
        soundToPlay.currentTime = 0;
        soundToPlay.play().catch(e => console.warn(`Breath sound (${type}) play failed:`, e));
    }
  };


  const updateShantiSaysForPhase = useCallback((phase: TechniquePhase | undefined, forceSpeak = false) => {
    if(!isMountedRef.current || !phase) return;

    let text = phase.text || phase.details || '';
    const type = phase.type.toLowerCase();

    if (type.includes('inhale') && !text.toLowerCase().includes('inhale')) text = `Inhale... ${text}`;
    else if (type.includes('exhale') && !text.toLowerCase().includes('exhale')) text = `Exhale... ${text}`;
    else if (type.includes('hold_in') && !text.toLowerCase().includes('hold')) text = `Hold your breath... ${text}`;
    else if (type.includes('hold_out') && !text.toLowerCase().includes('hold')) text = `Hold the breath out... ${text}`;
    else if (type.includes('pause') && !text.toLowerCase().includes('pause')) text = `Pause briefly... ${text}`;
    else if (type.includes('hum') && !text.toLowerCase().includes('hum')) text = `Hum... ${text}`;

    if (!text.trim() && phase.type !== 'instruction') text = 'Follow the animation and breath sounds.';

    if (text !== shantiSays || forceSpeak) {
      setShantiSays(text);
      if (speak && !isPaused && !showInitialInstruction && !isSpeaking && text) {
        speak(text);
      }
    }
    if (!isPaused && !showInitialInstruction) {
        if (type.includes('inhale') || type.includes('nostril_inhale')) playBreathSound('inhale');
        else if (type.includes('exhale') || type.includes('nostril_exhale') || type.includes('hum')) playBreathSound('exhale');
    }

  }, [speak, isPaused, showInitialInstruction, shantiSays, isSpeaking]);


  const advancePhaseOrRound = useCallback(() => {
    if (!isMountedRef.current || isSpeaking) return;

    let baseMessage = "";
    let onSpeakEndCallback: (() => void) | undefined = undefined;

    if (currentPhaseIndex < technique.phases.length - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
      setCurrentPhaseTimer(0);
      setPhaseProgress(0);
    } else {
      if (currentRound < totalRounds) {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setCurrentPhaseIndex(0);
        setCurrentPhaseTimer(0);
        setPhaseProgress(0);
        baseMessage = SHANTI_MESSAGES.startingRound.replace('{roundNumber}', String(nextRound));
        if (userProfile.usesBreathSensorConceptually && nextRound % 2 === 0) {
            baseMessage += " " + SHANTI_MESSAGES.practiceSensorRhythmCheck;
        }
      } else {
        baseMessage = technique.finalInstruction;
        onSpeakEndCallback = () => { if(isMountedRef.current) onComplete(true); };
        setShantiSays(baseMessage);
      }
    }
     if (speak && baseMessage && isMountedRef.current) {
        speak(baseMessage, () => { if(isMountedRef.current && onSpeakEndCallback) setTimeout(onSpeakEndCallback, 50); });
     } else if (onSpeakEndCallback && isMountedRef.current) {
         setTimeout(onSpeakEndCallback, 50);
     }
  }, [currentPhaseIndex, currentRound, technique.phases.length, technique.finalInstruction, totalRounds, onComplete, speak, isSpeaking, userProfile.usesBreathSensorConceptually]);

  useEffect(() => {
    if (!isMountedRef.current) return;

    currentPhaseRef.current = technique.phases[currentPhaseIndex] || null;
    const currentPhase = currentPhaseRef.current;

    if (showInitialInstruction || isPaused || !currentPhase || isSpeaking || currentPhaseIndex < 0) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      return;
    }

    updateShantiSaysForPhase(currentPhase);

    const phaseDuration = currentPhase.duration || 0;

    if (currentPhaseTimer <= 0 && phaseDuration > 0) {
      setCurrentPhaseTimer(phaseDuration);
    }

    if (phaseDuration > 0) {
      setPhaseProgress(0);
      if (timerIdRef.current) clearInterval(timerIdRef.current);

      timerIdRef.current = window.setInterval(() => {
        if(!isMountedRef.current || isPaused) {
          if(timerIdRef.current) clearInterval(timerIdRef.current);
          return;
        }
        setCurrentPhaseTimer(prev => {
          const newTime = prev - 1;
          if (newTime >= 0 && phaseDuration > 0) {
            setPhaseProgress(1 - (newTime / phaseDuration));
          }
          if (newTime < 0) {
            if (timerIdRef.current) clearInterval(timerIdRef.current);
            timerIdRef.current = null;
            advancePhaseOrRound();
          }
          return newTime;
        });
      }, 1000);

      return () => {
        if (timerIdRef.current) clearInterval(timerIdRef.current);
      };
    } else {
      setPhaseProgress(1);
    }
  }, [currentPhaseIndex, currentRound, isPaused, showInitialInstruction, updateShantiSaysForPhase, isSpeaking, advancePhaseOrRound, technique.phases]);


  const handleStartPractice = useCallback(() => {
    if(!isMountedRef.current || isSpeaking) return;
    cancelSpeech();
    setShowInitialInstruction(false);
    setCurrentPhaseIndex(0);
    setCurrentPhaseTimer(0);
    setPhaseProgress(0);
    setCurrentRound(1);
    setIsPaused(false);

    const firstPhase = technique.phases[0];
    if (firstPhase && isMountedRef.current) {
        let firstPhaseText = firstPhase.text || firstPhase.details || 'Follow the animation and breath sounds.';
        const commandInfo = SHANTI_MESSAGES.practiceCommandInfo;
        if(userProfile.usesBreathSensorConceptually) {
            firstPhaseText += " " + SHANTI_MESSAGES.practiceSensorDepthCheck;
        }

        setShantiSays(firstPhaseText);
        if (speak && isMountedRef.current && !isSpeaking) {
            speak(firstPhaseText + " " + commandInfo, () => {
              if(isMountedRef.current) setTimeout(() => setHasInformedCommands(true), 50);
            });
        } else if(isMountedRef.current) {
            setTimeout(() => setHasInformedCommands(true), 50);
        }
        const type = firstPhase.type.toLowerCase();
        if (type.includes('inhale') || type.includes('nostril_inhale')) playBreathSound('inhale');
        else if (type.includes('exhale') || type.includes('nostril_exhale') || type.includes('hum')) playBreathSound('exhale');

    }
  }, [speak, isSpeaking, technique.phases, userProfile.usesBreathSensorConceptually, cancelSpeech]);

  const handleTogglePause = useCallback(() => {
    if(!isMountedRef.current) return;
    const newPausedState = !isPaused;
    setIsPaused(newPausedState);

    if (newPausedState) {
        if(isListeningValue) stopListening();
        cancelSpeech();
        inhaleSoundRef.current?.pause();
        exhaleSoundRef.current?.pause();
        if (speak && !isSpeaking && isMountedRef.current) {
            const pauseText = SHANTI_MESSAGES.practicePaused;
            setShantiSays(pauseText);
            speak(pauseText);
        }
    } else {
        const currentPhase = currentPhaseRef.current;
        if (speak && currentPhase && !isSpeaking && isMountedRef.current) {
            const phaseText = currentPhase.text || currentPhase.details || 'Follow the animation and breath sounds.';
            const resumeText = SHANTI_MESSAGES.practiceResuming + phaseText;
            setShantiSays(phaseText);
            speak(resumeText);
            const type = currentPhase.type.toLowerCase();
            if (type.includes('inhale') || type.includes('nostril_inhale')) playBreathSound('inhale');
            else if (type.includes('exhale') || type.includes('nostril_exhale') || type.includes('hum')) playBreathSound('exhale');
        }
    }
  }, [isPaused, speak, stopListening, isListeningValue, isSpeaking, cancelSpeech]);

  const handleStop = useCallback(() => {
    if (!isMountedRef.current) return;
    console.log("PranayamaTechniquePlayer: handleStop called");
    if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
    }
    cancelSpeech();
    stopListening();
    inhaleSoundRef.current?.pause();
    exhaleSoundRef.current?.pause();
    onComplete(false);
    const stopMsg = SHANTI_MESSAGES.stoppingTechnique;
    const safetyReminderMsg = SHANTI_MESSAGES.safetyReminder;
    if (speak && !isSpeaking && isMountedRef.current) {
        speak(stopMsg + safetyReminderMsg);
    } else {
        setShantiSays(stopMsg);
    }
    onIssueReported("User stopped the technique via button.");
  }, [cancelSpeech, stopListening, onComplete, speak, isSpeaking, onIssueReported]);

  const handleInstructionalPhaseNext = useCallback(() => {
    if (!isMountedRef.current) return;
    const currentPhase = currentPhaseRef.current;
    if (currentPhase && !currentPhase.duration && !isSpeaking) {
        advancePhaseOrRound();
    }
  }, [advancePhaseOrRound, isSpeaking]);

  const processVoiceCommand = useCallback((transcript: string) => {
    if(!isMountedRef.current || isSpeaking) return;
    const command = transcript.toLowerCase().trim();
    const currentPhase = currentPhaseRef.current;

    const speakThenAct = (messageKey: keyof typeof SHANTI_MESSAGES, action?: () => void) => {
        if (speak && !isSpeaking && isMountedRef.current) {
            cancelSpeech();
            speak(SHANTI_MESSAGES[messageKey], () => { if(isMountedRef.current && action) setTimeout(action, 50); });
        } else if (action && isMountedRef.current) {
            setTimeout(action, 50);
        }
    };

    if (command.includes("stop") || command.includes("detener")) {
        speakThenAct("cmdStop", handleStop);
    } else if (command.includes("pause") || command.includes("pausa")) {
        if (!isPaused) speakThenAct("cmdPause", handleTogglePause);
    } else if (command.includes("resume") || command.includes("continue") || command.includes("start again") || command.includes("reanudar") || command.includes("continuar")) {
        if (isPaused) speakThenAct("cmdResume", handleTogglePause);
    } else if (command.includes("next step") || command.includes("next") || command.includes("siguiente paso") || command.includes("siguiente")) {
        if (currentPhase && !currentPhase.duration) {
            speakThenAct("cmdNextStep", handleInstructionalPhaseNext);
        } else {
            speakThenAct("cmdTimedPhaseInfo");
        }
    } else if (command.includes("explain this") || command.includes("explain") || command.includes("help") || command.includes("having trouble") || command.includes("explica esto") || command.includes("ayuda") || command.includes("tengo problemas")) {
        let explainMsg = "";
        if (currentPhase?.type === 'instruction' && currentPhase?.text) {
            explainMsg = currentPhase.text;
        } else if (currentPhase?.text && currentPhase?.duration) {
            explainMsg = currentPhase.text;
        } else {
            explainMsg = technique.initialInstruction;
        }

        if (speak && !isSpeaking && isMountedRef.current) {
            cancelSpeech();
            speak(SHANTI_MESSAGES.explainConceptAck + " " + explainMsg, () => {
                if ((command.includes("help") || command.includes("ayuda") || command.includes("having trouble") || command.includes("tengo problemas")) && isMountedRef.current) {
                    setTimeout(() => onIssueReported("User asked for help/explanation via voice."), 50);
                }
            });
        } else if ((command.includes("help") || command.includes("ayuda") || command.includes("having trouble") || command.includes("tengo problemas")) && isMountedRef.current) {
             setTimeout(() => onIssueReported("User asked for help/explanation via voice."), 50);
        }
    } else if (command.includes("slower") || command.includes("too fast") || command.includes("más lento") || command.includes("demasiado rápido")) {
        speakThenAct("cmdPaceFeedback");
    } else {
        console.log("Command not recognized:", command);
    }
  }, [speak, isSpeaking, handleStop, isPaused, handleTogglePause, handleInstructionalPhaseNext, onIssueReported, technique.initialInstruction, cancelSpeech]);

  useEffect(() => {
    if (!isMountedRef.current) return;
    if (!showInitialInstruction && hasInformedCommands && !isPaused && !isSpeaking && !isListeningValue) {
        listen(
            processVoiceCommand,
            () => console.log("PranayamaTechniquePlayer: Listening for commands started."),
            () => console.log("PranayamaTechniquePlayer: Listening for commands ended."),
            (error) => console.error("PranayamaTechniquePlayer: Command listening error:", error),
            { continuous: false, interimResults: false }
        );
    } else if (isListeningValue && (isPaused || isSpeaking || showInitialInstruction || !hasInformedCommands)) {
        stopListening();
    }
  }, [
    showInitialInstruction, hasInformedCommands, isPaused, isSpeaking, isListeningValue,
    listen, stopListening, processVoiceCommand
  ]);

  const handlePlayerTap = () => {
    if (!isMountedRef.current || isSpeaking) return;

    if (showInitialInstruction) {
        handleStartPractice();
    } else {
        const currentPhase = currentPhaseRef.current;
        if (currentPhase && !currentPhase.duration) {
            handleInstructionalPhaseNext();
        } else {
            handleTogglePause();
        }
    }
  };

  const handleHavingTroubleClick = () => {
    if (!isMountedRef.current || isSpeaking) return;
    cancelSpeech();
    const currentPhase = currentPhaseRef.current;
    let explainMsg = "";
     if (currentPhase?.type === 'instruction' && currentPhase?.text) {
        explainMsg = currentPhase.text;
    } else if (currentPhase?.text && currentPhase?.duration) {
        explainMsg = currentPhase.text;
    } else {
        explainMsg = technique.initialInstruction;
    }

    const speakAndReport = () => {
        if(speak && !isSpeaking && isMountedRef.current) {
            speak(SHANTI_MESSAGES.explainConceptAck + " " + explainMsg, () => {
               if(isMountedRef.current) setTimeout(() => onIssueReported("User needs help or has a concern (clicked 'Having Trouble?' button)."), 50);
            });
        } else if (isMountedRef.current){
            setTimeout(() => onIssueReported("User needs help or has a concern (clicked 'Having Trouble?' button). Explanation could not be spoken."), 50);
        }
    };
    setTimeout(speakAndReport, 50);
  };

  const beginButtonText = SHANTI_MESSAGES.ptpBeginButtonText.replace('{techniqueName}', technique.name);
  const loadingText = SHANTI_MESSAGES.ptpLoadingText;
  const roundText = SHANTI_MESSAGES.ptpRoundText.replace('{currentRound}', String(currentRound)).replace('{totalRounds}', String(totalRounds));
  const phaseTimeInstructionText = SHANTI_MESSAGES.ptpPhaseTimeInstructionText;
  const nextStepButtonText = SHANTI_MESSAGES.ptpNextStepButtonText;
  const resumeButtonText = SHANTI_MESSAGES.ptpResumeButtonText;
  const pauseButtonText = SHANTI_MESSAGES.ptpPauseButtonText;
  const stopTechniqueButtonText = SHANTI_MESSAGES.ptpStopTechniqueButtonText;
  const havingTroubleButtonText = SHANTI_MESSAGES.ptpHavingTroubleButtonText;
  const listeningCommandsText = SHANTI_MESSAGES.ptpListeningCommandsText;
  const hintTapAnimationText = SHANTI_MESSAGES.ptpHintTapAnimationText;

  const currentPhaseForDisplay = currentPhaseRef.current;

  if (showInitialInstruction) {
    return (
      <div className="p-4 text-center" onClick={isSpeaking ? undefined : handleStartPractice} role="button" tabIndex={0} aria-label={beginButtonText}>
        <div className="my-4 p-4 bg-[var(--theme-bg-card)] rounded-lg shadow-xl">
           <h3 className="text-2xl font-semibold text-[var(--theme-text-heading)] mb-3" style={{fontFamily: "'Lora', serif"}}>{technique.name}</h3>
          <div className="mb-4 flex justify-center">
             <BreathingAnimator technique={technique} currentPhase={null} phaseProgress={0} isInstructionalView={true} />
          </div>
          <ShantiSpeaks message={shantiSays} avatar={false}/>
          <p className="text-[var(--theme-text-body)] mt-2 mb-4 text-sm text-left">{technique.description}</p>

          {technique.benefits && (
            <div className="mt-3 text-left">
              <h4 className="font-semibold text-[var(--theme-highlight-accent)] text-sm">{SHANTI_MESSAGES.ptpBenefitsTitle}</h4>
              <ul className="list-disc list-inside text-sm text-[var(--theme-text-muted)] space-y-0.5">
                {technique.benefits.map((b: string, i: number) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          )}
          {technique.contraindications && (
             <div className="mt-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-left">
              <h4 className="font-semibold text-yellow-700 text-sm">{SHANTI_MESSAGES.ptpContraindicationsTitle}</h4>
               <ul className="list-disc list-inside text-sm text-yellow-600 space-y-0.5">
                {technique.contraindications.map((c: string, i: number) => <li key={i}>{c}</li>)}
              </ul>
            </div>
          )}
        </div>
        <button
          className="mt-4 px-8 py-3 bg-[var(--theme-action-primary-bg)] text-[var(--theme-action-primary-text)] font-medium rounded-lg shadow-md hover:bg-[var(--theme-action-primary-bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-highlight-focus)] transition-colors duration-150 ease-in-out"
          disabled={isSpeaking}
        >
          {beginButtonText}
        </button>
      </div>
    );
  }

  if (!currentPhaseForDisplay) {
    return <div className="p-4 text-center text-[var(--theme-text-muted)]">{loadingText}</div>;
  }

  const phaseTimeDisplay = currentPhaseForDisplay.duration ? `${Math.max(0, currentPhaseTimer)}s` : phaseTimeInstructionText;

  return (
    <div className="p-2 md:p-4 flex flex-col items-center">
      <h2 className="text-3xl font-semibold text-[var(--theme-text-heading)] mb-1" style={{fontFamily: "'Lora', serif"}}>{technique.name}</h2>
      <p className="text-[var(--theme-text-muted)] mb-4 font-medium">{roundText}</p>

      <div onClick={handlePlayerTap} role="button" aria-label="Tap to pause or resume technique" tabIndex={0} className="cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-highlight-focus)]">
        <BreathingAnimator technique={technique} currentPhase={currentPhaseForDisplay} phaseProgress={phaseProgress} isInstructionalView={false} />
      </div>

      <div className="my-4 p-4 bg-[var(--theme-bg-card)] rounded-lg shadow-lg w-full max-w-md text-center">
        <ShantiSpeaks message={shantiSays} avatar={false} />
        <p className="text-3xl font-bold text-[var(--theme-highlight-accent)] mt-2">{phaseTimeDisplay}</p>
      </div>

      {!currentPhaseForDisplay.duration && !isSpeaking && (
         <button
          onClick={handleInstructionalPhaseNext}
          className="mt-2 px-5 py-2.5 bg-sky-500 text-white font-medium rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition-colors disabled:opacity-50" // This button's theme is not yet updated, consider secondary action style
          disabled={isSpeaking}>
            {nextStepButtonText}
        </button>
      )}

      <div className="flex space-x-3 mt-6">
        <button
          onClick={handleTogglePause}
          className={`px-6 py-2.5 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out text-white
            ${isPaused ? 'bg-green-500 hover:bg-green-600 focus:ring-green-400' : 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400'} // These colors are not theme based yet
            disabled:isSpeaking && !isPaused`}
          disabled={isSpeaking && !isPaused}
        >
          {isPaused ? resumeButtonText : pauseButtonText}
        </button>
        <button
          onClick={handleStop}
          className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors duration-150 ease-in-out" // This color is not theme based
        >
          {stopTechniqueButtonText}
        </button>
      </div>
       <button
          onClick={handleHavingTroubleClick}
          className="mt-5 px-5 py-2 text-sm bg-[var(--theme-action-secondary-bg)] text-[var(--theme-action-secondary-text)] font-medium rounded-lg shadow hover:bg-[var(--theme-action-secondary-bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--theme-border-interactive)] transition-colors duration-150 ease-in-out disabled:opacity-60"
          disabled={isSpeaking}
        >
          {havingTroubleButtonText}
        </button>
        {isListeningValue && <p className="mt-2 text-sm text-[var(--theme-text-link)] animate-pulse font-medium">{listeningCommandsText}</p>}
        <p className="mt-4 text-xs text-[var(--theme-text-muted)]">{hintTapAnimationText}</p>
    </div>
  );
};

export default PranayamaTechniquePlayer;