import React, { useState, useEffect, useCallback } from 'react';
import { ExperienceLevel, UserProfile, StageControlProps, AppTier, UserType } from '../types'; 
import { SHANTI_MESSAGES } from '../constants';
import ShantiSpeaks from './ShantiSpeaks';
import { useVoice } from '../VoiceContext';

interface WelcomeStageProps extends StageControlProps {
  onComplete: (profile: UserProfile) => void;
  onProfileUpdate: (profileUpdates: Partial<UserProfile>) => void;
  speak: (text: string, onEnd?: () => void) => void;
  listen: (
    onResult: (transcript: string) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ) => void;
  stopListening: () => void;
  isSpeaking: boolean;
  appTier: AppTier;
}

const WelcomeStage: React.FC<WelcomeStageProps> = ({
    onComplete, onProfileUpdate,
    speak, listen, stopListening, isSpeaking, onAdvanceByTap, appTier
}) => {
  const [localProfile, setLocalProfile] = useState<Partial<UserProfile>>({
    experienceLevel: null,
    userType: null, 
    feelingStart: '',
    goals: '',
    appTier: appTier,
  });
  const [currentDisplayMessage, setCurrentDisplayMessage] = useState(SHANTI_MESSAGES.welcome);
  const [step, setStep] = useState(0); 

  const { permissionStatus, requestPermission, isSupported, isListening: isListeningValue, cancelSpeech, speechBlocked } = useVoice();

  useEffect(() => {
    setLocalProfile(prev => ({ ...prev, appTier: appTier }));
  }, [appTier]);


  const updateLocalProfile = useCallback((updates: Partial<UserProfile>) => {
    setLocalProfile(prev => ({ ...prev, ...updates }));
    onProfileUpdate(updates);
  }, [onProfileUpdate]);

  const advanceStep = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  const speakAndAdvance = useCallback((messageKey: keyof typeof SHANTI_MESSAGES, nextStepValue?: number) => {
    const message = SHANTI_MESSAGES[messageKey];
    setCurrentDisplayMessage(message);
    speak(message, () => {
      if (nextStepValue !== undefined) setStep(nextStepValue);
      else advanceStep();
    });
  }, [speak, advanceStep]);

  const handleUserTypeSelection = (type: UserType) => {
    if(isListeningValue) stopListening();
    if(isSpeaking) cancelSpeech();
    updateLocalProfile({ userType: type });
    const message = SHANTI_MESSAGES.selectedUserType.replace('{userType}', type);
    setCurrentDisplayMessage(message);
    speak(message, () => setStep(3)); 
  };

  const handleExperienceSelection = (level: ExperienceLevel) => {
    if(isListeningValue) stopListening();
    if(isSpeaking) cancelSpeech();
    updateLocalProfile({ experienceLevel: level });
    let message = SHANTI_MESSAGES.selectedExperience.replace('{experienceLevel}', level);
    if (localProfile.userType === UserType.KID) {
        message += " " + SHANTI_MESSAGES.kidsFocusMessageGeneral;
    }
    setCurrentDisplayMessage(message);
    speak(message, () => setStep(5)); 
  };

  const handleSpeechError = useCallback((error: string) => {
    console.error("Speech recognition error in WelcomeStage:", error);
    let errorMessageKey: keyof typeof SHANTI_MESSAGES = "speechErrorDefault";
    if (error.toLowerCase().includes('no-speech')) errorMessageKey = "speechErrorNoSpeech";
    else if (error.toLowerCase().includes('denied') || error.toLowerCase().includes('not-allowed')) errorMessageKey = "speechErrorMicDenied";
    else errorMessageKey = "speechErrorTryAgain";

    const baseMessage = SHANTI_MESSAGES[errorMessageKey];
    setCurrentDisplayMessage(baseMessage);
    if (!speechBlocked) {
        speak(baseMessage);
    }
  }, [speak, speechBlocked]);

  const processFeeling = useCallback((transcript: string) => {
    updateLocalProfile({ feelingStart: transcript});
    const confirmationText = `${SHANTI_MESSAGES.thankYouForSharing} You feel: ${transcript}.`;
    setCurrentDisplayMessage(confirmationText);
    speak(confirmationText, () => setStep(7)); 
  }, [speak, updateLocalProfile]);

  const processGoals = useCallback((transcript: string) => {
    updateLocalProfile({ goals: transcript });
    const confirmationText = `${SHANTI_MESSAGES.wonderfulGoal} Goal: ${transcript}.`;
    setCurrentDisplayMessage(confirmationText);
    speak(confirmationText, () => setStep(9)); 
  }, [speak, updateLocalProfile]);

  useEffect(() => {
    if (isSpeaking && ![2,4,6,8].includes(step)) return;

    const performListen = (processor: (transcript: string) => void, promptMessageKey: keyof typeof SHANTI_MESSAGES) => {
        const promptMsg = SHANTI_MESSAGES[promptMessageKey];
        setCurrentDisplayMessage(promptMsg);
        if (speechBlocked || permissionStatus !== 'granted' || !isSupported) {
            return;
        }
        if (!isListeningValue) {
            listen(processor, undefined, undefined, handleSpeechError);
        }
      };

    switch (step) {
      case 0: speakAndAdvance("welcome", 1); break;
      case 1: speakAndAdvance("askUserType", 2); break;
      case 2: setCurrentDisplayMessage(SHANTI_MESSAGES.askUserType + " (Please select below)"); break;
      case 3: speakAndAdvance("askExperience", 4); break;
      case 4: setCurrentDisplayMessage(SHANTI_MESSAGES.askExperience + " (Please select below)"); break;
      case 5: speakAndAdvance("askFeeling", 6); break;
      case 6: performListen(processFeeling, "tellMeFeeling"); break;
      case 7: speakAndAdvance("askGoals", 8); break;
      case 8: performListen(processGoals, "whatIsYourGoal"); break;
      case 9:
        const finalMsg = SHANTI_MESSAGES.finalWelcomeMessage;
        setCurrentDisplayMessage(finalMsg);
        speak(finalMsg, () => {
            if (localProfile.userType && localProfile.experienceLevel && localProfile.feelingStart && localProfile.goals) {
                onComplete({ ...localProfile, appTier: appTier } as UserProfile);
            } else {
                console.error("Cannot complete welcome stage: missing profile data.", localProfile);
                let errMsgKey: keyof typeof SHANTI_MESSAGES = "cannotCompleteWelcomeMissingExperience";
                let errorStep = 3; 
                if (!localProfile.userType) {
                    errMsgKey = "cannotCompleteWelcomeMissingUserType"; errorStep = 1;
                } else if (!localProfile.experienceLevel) {
                     errorStep = 3;
                } else if (!localProfile.feelingStart) errorStep = 5;
                else if (!localProfile.goals) errorStep = 7;
                
                const errMsg = SHANTI_MESSAGES[errMsgKey];
                setCurrentDisplayMessage(errMsg);
                if (!speechBlocked) speak(errMsg);
                setStep(errorStep);
            }
        });
        break;
    }
  }, [step, isSpeaking, permissionStatus, isSupported, speak, listen, processFeeling, processGoals, handleSpeechError, isListeningValue, localProfile, onComplete, advanceStep, speakAndAdvance, speechBlocked, appTier]);

  useEffect(() => {
    if (onAdvanceByTap) {
      if (isSpeaking || isListeningValue) return;

      if (step === 2 && !localProfile.userType) return;
      if (step === 4 && !localProfile.experienceLevel) return;
      if (step === 6 && !localProfile.feelingStart) return;
      if (step === 8 && !localProfile.goals) return;

      if (step < 9 ) { 
        if (step === 2 && localProfile.userType) {
            handleUserTypeSelection(localProfile.userType);
        } else if (step === 4 && localProfile.experienceLevel) {
            handleExperienceSelection(localProfile.experienceLevel);
        } else if (step === 6 && localProfile.feelingStart) {
            processFeeling(localProfile.feelingStart);
        } else if (step === 8 && localProfile.goals) {
            processGoals(localProfile.goals);
        }
        else if (![2,4,6,8].includes(step)) {
             advanceStep();
        }
      }
    }
  }, [onAdvanceByTap, step, isSpeaking, isListeningValue, localProfile, advanceStep, processFeeling, processGoals, handleExperienceSelection, handleUserTypeSelection]);


  const renderFallbackInputs = () => {
    if (step === 2) { 
        return (
          <div className="mt-6">
            <div className="space-y-3">
              {Object.values(UserType).map((type) => (
                <button
                  key={type}
                  onClick={() => handleUserTypeSelection(type)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all text-[var(--theme-text-body)]
                    ${localProfile.userType === type ? 'bg-[var(--theme-highlight-subtle)] border-[var(--theme-highlight-accent)] ring-2 ring-[var(--theme-highlight-accent)] shadow-md' : 'bg-[var(--theme-bg-card)] border-[var(--theme-border-interactive)] hover:border-[var(--theme-highlight-focus)] hover:bg-[var(--theme-highlight-subtle)]'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        );
      }

    if (step === 4) { 
      return (
        <div className="mt-6">
          {permissionStatus === 'prompt' && isSupported && (
            <button
                onClick={requestPermission}
                className="my-2 px-4 py-2 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 transition-colors"
            >Enable Microphone (Optional)
            </button>
          )}
          <div className="space-y-3">
            {Object.values(ExperienceLevel).map((level) => (
              <button
                key={level}
                onClick={() => handleExperienceSelection(level)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all text-[var(--theme-text-body)]
                  ${localProfile.experienceLevel === level ? 'bg-[var(--theme-highlight-subtle)] border-[var(--theme-highlight-accent)] ring-2 ring-[var(--theme-highlight-accent)] shadow-md' : 'bg-[var(--theme-bg-card)] border-[var(--theme-border-interactive)] hover:border-[var(--theme-highlight-focus)] hover:bg-[var(--theme-highlight-subtle)]'}`}
              >
                {level}
              </button>
            ))}
          </div>
           {localProfile.userType === UserType.KID && (
                <p className="mt-4 text-sm text-[var(--theme-text-link)] bg-[var(--theme-highlight-subtle)] p-3 rounded-md">{SHANTI_MESSAGES.kidsFocusMessageGeneral}</p>
            )}
        </div>
      );
    }

    if ((step === 6 || step === 8)) { 
        const isFeelingStep = step === 6;
        const currentTextValue = isFeelingStep ? localProfile.feelingStart : localProfile.goals;
        const placeholderKey: keyof typeof SHANTI_MESSAGES = isFeelingStep ? "askFeelingPlaceholder" : "askGoalsPlaceholder";
        const labelKey: keyof typeof SHANTI_MESSAGES = isFeelingStep ? "tellMeFeeling" : "whatIsYourGoal";
        const buttonTextKey: keyof typeof SHANTI_MESSAGES = isFeelingStep ? "confirmFeelingButton" : "confirmGoalButton";

        return (
            <div className="mt-6">
                <label htmlFor="text-fallback" className="text-lg font-medium text-[var(--theme-text-heading)] mb-3 block">
                    {SHANTI_MESSAGES[labelKey]}
                </label>
                <textarea
                    id="text-fallback"
                    value={currentTextValue || ''}
                    onChange={(e) => updateLocalProfile(isFeelingStep ? { feelingStart: e.target.value } : { goals: e.target.value })}
                    placeholder={SHANTI_MESSAGES[placeholderKey]}
                    className="w-full p-3 mt-1 border border-[var(--theme-border-interactive)] rounded-lg focus:ring-2 focus:ring-[var(--theme-highlight-focus)] focus:border-[var(--theme-highlight-focus)] shadow-sm bg-[var(--theme-bg-card)] text-[var(--theme-text-body)]"
                    rows={3}
                />
                <button
                    onClick={() => {
                        if(isListeningValue) stopListening();
                        if(isSpeaking) cancelSpeech();
                        const valueToProcess = (isFeelingStep ? localProfile.feelingStart : localProfile.goals) || "";
                        if (valueToProcess.trim()) {
                            if (isFeelingStep) processFeeling(valueToProcess.trim());
                            else processGoals(valueToProcess.trim());
                        } else {
                            const pleaseTypeMsg = "Please type your response.";
                            if (!speechBlocked) speak(pleaseTypeMsg); else setCurrentDisplayMessage(pleaseTypeMsg);
                        }
                    }}
                    className="mt-3 px-6 py-2.5 bg-[var(--theme-action-primary-bg)] text-[var(--theme-action-primary-text)] font-medium rounded-lg shadow hover:bg-[var(--theme-action-primary-bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-highlight-focus)] transition-colors"
                >
                    {SHANTI_MESSAGES[buttonTextKey]}
                </button>
            </div>
        );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto text-center">
      <ShantiSpeaks message={currentDisplayMessage} />

      {renderFallbackInputs()}

      {(step === 6 || step === 8) && !isSpeaking && !isListeningValue && permissionStatus === 'granted' && isSupported && !speechBlocked && (
        <button
          onClick={() => {
            const processor = step === 6 ? processFeeling : processGoals;
            listen(processor, undefined, undefined, handleSpeechError);
          }}
          className="mt-4 px-5 py-2.5 bg-sky-500 text-white font-medium rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition-colors"
          aria-label={SHANTI_MESSAGES.tapToSpeakResponse}
        >
          {SHANTI_MESSAGES.tapToSpeakResponse}
        </button>
      )}
       {isListeningValue && (step === 6 || step === 8) && (
         <p className="mt-4 text-[var(--theme-text-link)] animate-pulse font-medium">{SHANTI_MESSAGES.listeningEllipsis}</p>
       )}
        { speechBlocked && (step === 6 || step === 8) &&
            <div className="mt-3 p-3 text-sm text-orange-600 bg-orange-50 border border-orange-300 rounded-md">Shanti's voice is currently unavailable. Please use the text box and button above.</div>
        }
        <p className="mt-6 text-xs text-[var(--theme-text-muted)]">Hint: You can tap the main screen to advance instructions if Shanti isn't speaking (and after selections).</p>
    </div>
  );
};

export default WelcomeStage;