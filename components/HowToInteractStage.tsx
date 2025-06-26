

import React, { useState, useEffect, useCallback } from 'react';
import { SHANTI_MESSAGES, HOW_TO_INTERACT_VOICE_COMMANDS_DISPLAY, APP_NAME } from '../constants';
import ShantiSpeaks from './ShantiSpeaks';
import { useVoice } from '../VoiceContext';
import { StageControlProps, UserProfile, AppTier } from '../types';

interface HowToInteractStageProps extends StageControlProps {
  onComplete: (profileUpdates: Partial<UserProfile>) => void;
  speak: (text: string, onEnd?: () => void) => void;
  listen: (
    onResult: (transcript: string) => void,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void,
    options?: { continuous?: boolean, interimResults?: boolean }
  ) => void;
  stopListening: () => void;
  isSpeaking: boolean;
  appTier: AppTier;
}

const HowToInteractStage: React.FC<HowToInteractStageProps> = ({
  onComplete,
  speak,
  listen,
  stopListening,
  isSpeaking,
  onAdvanceByTap,
  appTier
}) => {
  const [currentShantiMessage, setCurrentShantiMessage] = useState(SHANTI_MESSAGES.howToInteractIntro);
  const [step, setStep] = useState(0);
  const [usesSensorConceptually, setUsesSensorConceptually] = useState<boolean | undefined>(undefined);
  const { isListening: isListeningValue, permissionStatus, isSupported, cancelSpeech } = useVoice();

  const canShowSensorFeature = appTier === AppTier.FULL || appTier === AppTier.PREMIUM;

  const proceedToNextStep = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  const handleConfirmationResult = useCallback((transcript: string) => {
    const confirmation = transcript.toLowerCase();
    if (confirmation.includes("yes") || confirmation.includes("ready") || confirmation.includes("continue") || confirmation.includes("let's begin") ||
        confirmation.includes("sí") || confirmation.includes("listo") || confirmation.includes("lista") || confirmation.includes("continuar")) {
      speak(SHANTI_MESSAGES.howToInteractConfirmYes, () => onComplete({ usesBreathSensorConceptually: canShowSensorFeature ? usesSensorConceptually : false }));
    } else {
      const understandMessage = SHANTI_MESSAGES.howToInteractNotUnderstood;
      setCurrentShantiMessage(understandMessage);
      speak(understandMessage, () => {
        const confirmationStep = canShowSensorFeature ? 7 : 5; // Adjusted for new tip
        if (step === confirmationStep && permissionStatus === 'granted' && !isListeningValue && !isSpeaking) {
          listen(handleConfirmationResult, undefined, undefined, handleSpeechError);
        }
      });
    }
  }, [speak, onComplete, listen, permissionStatus, isListeningValue, isSpeaking, step, usesSensorConceptually, canShowSensorFeature]);

  const handleSensorChoiceResult = useCallback((transcript: string) => {
    const choice = transcript.toLowerCase();
    if (choice.includes("yes") || choice.includes("add sensor") || choice.includes("sí")) {
        setUsesSensorConceptually(true);
        speak(SHANTI_MESSAGES.howToInteractSensorYes, proceedToNextStep);
    } else if (choice.includes("no") || choice.includes("standard guidance")) {
        setUsesSensorConceptually(false);
        speak(SHANTI_MESSAGES.howToInteractSensorNo, proceedToNextStep);
    } else {
        const understandMessage = "I'm sorry, I didn't catch that. For an enhanced experience, would you like sensor-style prompts, or standard guidance?";
        setCurrentShantiMessage(understandMessage);
        speak(understandMessage, () => {
            if (permissionStatus === 'granted' && !isListeningValue && !isSpeaking) {
                listen(handleSensorChoiceResult, undefined, undefined, handleSpeechError);
            }
        });
    }
  }, [speak, proceedToNextStep, listen, permissionStatus, isListeningValue, isSpeaking]);


  const handleSpeechError = useCallback((error: string) => {
    console.error("Speech recognition error in HowToInteractStage:", error);
    let errorMessageKey: keyof typeof SHANTI_MESSAGES = "speechErrorDefault";
    if (error.toLowerCase().includes('no-speech')) {
        errorMessageKey = "speechErrorNoSpeech";
    } else {
         errorMessageKey = "speechErrorTryAgain";
    }
    const baseMessage = SHANTI_MESSAGES[errorMessageKey];
    const fullMessage = baseMessage + (errorMessageKey === "speechErrorNoSpeech" ? ` Try tapping a button or speaking again to continue your ${APP_NAME} setup.` : " Could you try speaking again clearly, or tap a button?");

    setCurrentShantiMessage(fullMessage);
    speak(fullMessage, () => {
        const sensorChoiceStep = canShowSensorFeature ? 6 : -1; // Adjusted
        const confirmationStep = canShowSensorFeature ? 7 : 5; // Adjusted

        let currentListenStep: ((transcript: string) => void) | undefined;
        if (step === sensorChoiceStep) currentListenStep = handleSensorChoiceResult;
        else if (step === confirmationStep) currentListenStep = handleConfirmationResult;

        if (currentListenStep && permissionStatus === 'granted' && !isListeningValue && !isSpeaking) {
             listen(currentListenStep, undefined, undefined, handleSpeechError);
        }
    });
  }, [speak, step, listen, handleConfirmationResult, handleSensorChoiceResult, permissionStatus, isListeningValue, isSpeaking, canShowSensorFeature]);


  useEffect(() => {
    if (isSpeaking) return;

    let messageKeys: (keyof typeof SHANTI_MESSAGES)[] = [
        "howToInteractIntro",
        "bestExperienceTip", // Added new tip here
        "howToInteractSessionFlow",
        "howToInteractVoiceCommands", 
        "howToInteractTap", 
    ];

    if (canShowSensorFeature) {
        messageKeys.push("howToInteractSensorIntro"); 
        messageKeys.push("howToInteractAskSensor");
    }
    messageKeys.push("howToInteractConfirmation");


    if (step < messageKeys.length) {
        const messageKey = messageKeys[step];
        
        let messageToSpeak = SHANTI_MESSAGES[messageKey];
        if (messageKey === "howToInteractSensorIntro" && canShowSensorFeature) {
           // Ensure this message uses APP_NAME correctly via constants.ts if it was hardcoded before
            messageToSpeak = `${APP_NAME} is designed for a focused, eyes-closed experience. For even deeper immersion and direct feedback on your breath's rhythm and depth—key to mastering your elemental energy—many find Bluetooth-enabled breath sensors highly beneficial. They allow for a truly hands-free practice.`;
        }
         if (messageKey === "howToInteractVoiceCommands") {
            messageToSpeak += " These allow for a seamless, hands-free, and eyes-closed practice, helping you maintain deep focus and balance. The app also features calming background music and subtle breath sounds to further enhance your immersion."
        }


        setCurrentShantiMessage(messageToSpeak);

        let onSpeakEndCallback: (() => void) | undefined;

        const sensorAskStep = canShowSensorFeature ? 6 : -1; // Adjusted
        const confirmationStep = canShowSensorFeature ? 7 : 5; // Adjusted

        if (step === sensorAskStep) {
            onSpeakEndCallback = () => {
                if (permissionStatus === 'granted' && !isListeningValue && !isSpeaking) {
                    listen(handleSensorChoiceResult, undefined, undefined, handleSpeechError);
                }
            };
        } else if (step === confirmationStep) {
             onSpeakEndCallback = () => {
                if (permissionStatus === 'granted' && !isListeningValue && !isSpeaking) {
                    listen(handleConfirmationResult, undefined, undefined, handleSpeechError);
                }
            };
        } else {
            onSpeakEndCallback = proceedToNextStep;
        }

        speak(messageToSpeak, onSpeakEndCallback);
    }
  }, [step, speak, proceedToNextStep, listen, handleConfirmationResult, handleSensorChoiceResult, handleSpeechError, isSpeaking, permissionStatus, isListeningValue, canShowSensorFeature]);

  useEffect(() => {
    if (onAdvanceByTap) {
      if (!isSpeaking) {
          handleAdvance();
      }
    }
  }, [onAdvanceByTap]);


  const handleAdvance = (sensorChoiceInput?: boolean) => {
    if (isListeningValue) stopListening();
    if (isSpeaking) cancelSpeech();

    const sensorChoiceStep = canShowSensorFeature ? 6 : -1; // Adjusted
    const confirmationStep = canShowSensorFeature ? 7 : 5; // Adjusted

    if (step === sensorChoiceStep) {
        const choice = sensorChoiceInput === undefined ? false : sensorChoiceInput;
        setUsesSensorConceptually(choice);
        const message = choice ? SHANTI_MESSAGES.howToInteractSensorYes : SHANTI_MESSAGES.howToInteractSensorNo;
        setCurrentShantiMessage(message);
        speak(message, proceedToNextStep);
    } else if (step < confirmationStep) {
      proceedToNextStep();
    } else if (step === confirmationStep) {
      speak(SHANTI_MESSAGES.howToInteractConfirmYes, () => onComplete({ usesBreathSensorConceptually: canShowSensorFeature ? usesSensorConceptually : false }));
    }
  };

  const sensorDisplayStep = canShowSensorFeature ? 6 : -1; // Adjusted
  const confirmationDisplayStep = canShowSensorFeature ? 7 : 5; // Adjusted


  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto text-center">
      <ShantiSpeaks message={currentShantiMessage} />

      {step >= 3 && step < (canShowSensorFeature ? 6 : 5) && ( // Adjusted step condition
        <div className="my-6 p-4 bg-white rounded-lg shadow-lg text-left">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Key Interaction Methods for {APP_NAME}:</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            {HOW_TO_INTERACT_VOICE_COMMANDS_DISPLAY.map(item => (
              <li key={item.command} className="flex items-start">
                <strong className="w-28 inline-block flex-shrink-0 font-medium text-teal-600">{item.command}</strong>
                <span>: {item.description}</span>
              </li>
            ))}
          </ul>
           {step >=4 && <p className="mt-4 text-sm text-teal-600 bg-teal-50 p-3 rounded-md">💡 You can also <strong>tap the screen</strong> to advance instructions or pause/resume during exercises. This, along with voice commands, supports an eyes-closed, immersive experience. You can also toggle background music using the icon in the header.</p>}
        </div>
      )}

      {step === sensorDisplayStep && canShowSensorFeature && (
        <div className="my-6 p-4 bg-white rounded-lg shadow-lg">
          <p className="text-slate-700 mb-4">{SHANTI_MESSAGES.howToInteractAskSensor}</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => handleAdvance(true)}
              className="px-6 py-3 bg-sky-500 text-white font-medium rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400"
              disabled={isSpeaking}
            >
              Yes, add sensor-style prompts
            </button>
            <button
              onClick={() => handleAdvance(false)}
              className="px-6 py-3 bg-slate-300 text-slate-700 font-medium rounded-lg shadow hover:bg-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
              disabled={isSpeaking}
            >
              No, use standard guidance
            </button>
          </div>
        </div>
      )}
      {!canShowSensorFeature && step === (sensorDisplayStep - 1) && ( // Adjusted step condition for LITE
        <div className="my-6 p-3 bg-sky-50 border border-sky-200 rounded-md">
          <p className="text-sm text-sky-700">{SHANTI_MESSAGES.liteVersionPromptSensor}</p>
        </div>
      )}


      {step === confirmationDisplayStep && (
        <>
            <button
                id="how-to-interact-stage-button"
                onClick={() => {
                    if (isListeningValue) stopListening();
                    if (isSpeaking) cancelSpeech();
                    speak(SHANTI_MESSAGES.howToInteractConfirmYes, () => onComplete({ usesBreathSensorConceptually: canShowSensorFeature ? usesSensorConceptually : false }));
                }}
                className="mt-6 px-8 py-3 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-150 ease-in-out"
                disabled={isSpeaking}
            >
                {SHANTI_MESSAGES.howToInteractLetsBeginButton}
            </button>
            {isListeningValue && <p className="mt-2 text-sky-600 animate-pulse font-medium">{SHANTI_MESSAGES.listeningEllipsis}</p>}
            {!isListeningValue && permissionStatus === 'granted' && isSupported && !isSpeaking && (
                 <button
                    onClick={() => listen(handleConfirmationResult, undefined, undefined, handleSpeechError)}
                    className="mt-4 px-5 py-2.5 bg-sky-500 text-white font-medium rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition-colors"
                    aria-label={SHANTI_MESSAGES.tapToSpeakResponse}
                    >
                    {SHANTI_MESSAGES.tapToSpeakResponse}
                </button>
            )}
        </>
      )}
      {step < confirmationDisplayStep && step !== sensorDisplayStep && (
         <button
            onClick={() => handleAdvance()}
            className="mt-4 px-5 py-2 bg-sky-100 text-sky-700 font-medium rounded-lg shadow hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-300 transition-colors text-sm"
            disabled={isSpeaking}
          >
            {SHANTI_MESSAGES.howToInteractNextTipButton}
          </button>
      )}
    </div>
  );
};

export default HowToInteractStage;
