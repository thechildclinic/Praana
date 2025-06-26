
import React, { useState, useEffect, useCallback } from 'react';
import { SHANTI_MESSAGES } from '../constants';
import ShantiSpeaks from './ShantiSpeaks';
import { useVoice } from '../VoiceContext'; 
import { StageControlProps, AppTier } from '../types'; // Added AppTier

interface FarewellStageProps extends StageControlProps {
  onEndSession: () => void; 
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
  appTier: AppTier; // Added appTier prop
}

const FarewellStage: React.FC<FarewellStageProps> = ({ 
    onEndSession, 
    speak, 
    listen, 
    stopListening, 
    isSpeaking,
    onAdvanceByTap,
    appTier // Destructure appTier
}) => {
  const [finalFeeling, setFinalFeeling] = useState('');
  const [currentShantiMessage, setCurrentShantiMessage] = useState(SHANTI_MESSAGES.farewell);
  const [step, setStep] = useState(0); 
  const { isListening: isListeningValue, permissionStatus, isSupported, cancelSpeech } = useVoice();

  useEffect(() => {
    const messageKeys: (keyof typeof SHANTI_MESSAGES)[] = ["farewell", "farewellAskFeeling", "farewellAskFeeling", "practiceSuggestion", "safetyReminder"];
    if (step < messageKeys.length) {
        let key = messageKeys[step];
        if (step === 2) key = "farewellAskFeeling"; 
        else if (step === 4) key = "safetyReminder"; 

        setCurrentShantiMessage(SHANTI_MESSAGES[key] + (step === 4 ? " Feel free to end the session when you're ready." : ""));
    } else if (step >= messageKeys.length) { 
        setCurrentShantiMessage(SHANTI_MESSAGES.safetyReminder + " Feel free to end the session when you're ready.");
    }
  }, [step]);

  const advanceFarewellStep = useCallback(() => {
    setStep(prev => prev + 1);
  }, []);

  const handleFinalFeelingResult = useCallback((transcript: string) => {
      setFinalFeeling(transcript);
      const confirmation = `Feeling: ${transcript}. That's wonderful to acknowledge.`;
      setCurrentShantiMessage(confirmation);
      speak(confirmation, () => setStep(3));
  }, [speak]);
  
  const handleSpeechErrorFarewell = useCallback((error: string) => {
    console.error("Speech recognition error in FarewellStage:", error);
    let errorMessageKey: keyof typeof SHANTI_MESSAGES = "speechErrorDefault";
    if (error.toLowerCase().includes('no-speech')) {
        errorMessageKey = "speechErrorNoSpeech";
    } else {
        errorMessageKey = "speechErrorTryAgain";
    }
    const baseMessage = SHANTI_MESSAGES[errorMessageKey];
    const fullMessage = baseMessage + (errorMessageKey === "speechErrorNoSpeech" ? " You can type your feeling or tap 'End Session'." : " Could you try speaking again, type your response, or tap 'End Session'?");
    
    setCurrentShantiMessage(fullMessage);
    speak(fullMessage, () => {
        if (step === 2 && permissionStatus === 'granted' && !isListeningValue && !isSpeaking) {
             listen(handleFinalFeelingResult, undefined, undefined, handleSpeechErrorFarewell);
        }
    });
  }, [speak, step, listen, permissionStatus, isListeningValue, isSpeaking, handleFinalFeelingResult]);


  useEffect(() => {
    if (isSpeaking) return; 

    let messageKey: keyof typeof SHANTI_MESSAGES | "" = "";
    let speakCallback: (() => void) | undefined = advanceFarewellStep;

    switch(step) {
        case 0: messageKey = "farewell"; break;
        case 1:
            messageKey = "farewellAskFeeling"; 
            speakCallback = () => {
                setStep(2); 
                if (permissionStatus === 'granted' && !isListeningValue && !isSpeaking) {
                    listen(handleFinalFeelingResult, undefined, undefined, handleSpeechErrorFarewell);
                }
            };
            break;
        case 2: 
            setCurrentShantiMessage(SHANTI_MESSAGES.farewellAskFeeling + " (Type or Speak)");
            return; 
        case 3: messageKey = "practiceSuggestion"; break;
        case 4:
            messageKey = "safetyReminder";
            const appendText = " Feel free to end the session when you're ready.";
            const fullMsg = SHANTI_MESSAGES[messageKey] + appendText;
            setCurrentShantiMessage(fullMsg);
            speak(fullMsg); 
            return; 
        default: return; 
    }
    if (messageKey) {
        const messageToSpeak = SHANTI_MESSAGES[messageKey];
        setCurrentShantiMessage(messageToSpeak);
        speak(messageToSpeak, speakCallback);
    }

  }, [step, speak, listen, isSpeaking, advanceFarewellStep, permissionStatus, isListeningValue, handleFinalFeelingResult, handleSpeechErrorFarewell]);

  useEffect(() => {
    if (onAdvanceByTap) { 
        if (isSpeaking) return;
        if (step < 4) {
             if(isSpeaking) cancelSpeech();
             advanceFarewellStep();
        } else if (step === 4) {
            handleEnd(); 
        }
    }
  }, [onAdvanceByTap, step, isSpeaking, advanceFarewellStep, cancelSpeech]);


  const handleEnd = () => {
    if (isListeningValue) stopListening();
    speak(SHANTI_MESSAGES.sessionEnded, onEndSession);
  };
  
  const submitTypedFeeling = () => {
    if(isListeningValue) stopListening();
    if(isSpeaking) cancelSpeech();
    if (finalFeeling.trim()) {
        handleFinalFeelingResult(finalFeeling.trim());
    } else {
        speak("Please type in how you're feeling, or you can skip this by clicking 'End Session'.");
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto text-center">
      <ShantiSpeaks message={currentShantiMessage} />
      
      {step === 2 && (
        <div className="my-6 p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-xl font-medium text-teal-700 mb-3">{SHANTI_MESSAGES.farewellAskFeeling}</h2>
          <textarea
            value={finalFeeling}
            onChange={(e) => setFinalFeeling(e.target.value)}
            placeholder={SHANTI_MESSAGES.farewellFeelingPlaceholder}
            className="w-full p-3 mt-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
            rows={3}
          />
          <div className="mt-4 space-x-3">
            <button 
              onClick={submitTypedFeeling}
              className="px-5 py-2.5 bg-teal-600 text-white font-medium rounded-lg shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              disabled={isSpeaking}
            >
              {SHANTI_MESSAGES.farewellConfirmFeelingButton}
            </button>
            {permissionStatus === 'granted' && isSupported && !isListeningValue && !isSpeaking &&(
              <button 
                  onClick={() => listen(handleFinalFeelingResult, undefined, undefined, handleSpeechErrorFarewell)}
                  className="px-5 py-2.5 bg-sky-500 text-white font-medium rounded-lg shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-400 transition-colors"
                  disabled={isSpeaking}
                >
                  {SHANTI_MESSAGES.farewellSpeakFeelingButton}
              </button>
            )}
          </div>
          {isListeningValue && <p className="mt-3 text-sky-600 animate-pulse font-medium">{SHANTI_MESSAGES.listeningEllipsis}</p>}
        </div>
      )}

      <button
        onClick={handleEnd}
        className="mt-8 px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150 ease-in-out disabled:opacity-60"
        disabled={isSpeaking && step < 4} 
      >
        {SHANTI_MESSAGES.farewellEndSessionButton}
      </button>
       <p className="mt-4 text-xs text-slate-500">Hint: You can tap the screen to advance Shanti's messages or end the session if on the final step.</p>
    </div>
  );
};

export default FarewellStage;