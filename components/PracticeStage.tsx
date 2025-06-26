
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PranayamaTechnique, PranayamaTechniqueId, ExperienceLevel, UserProfile, SessionStage, ModalContent, AppTier, UserType } from '../types';
import { TECHNIQUES, SHANTI_MESSAGES, LITE_TIER_TECHNIQUE_LIMIT } from '../constants';
import PranayamaTechniquePlayer from './PranayamaTechniquePlayer';
import ShantiSpeaks from './ShantiSpeaks';

interface PracticeStageProps {
  userProfile: UserProfile;
  onCompleteStage: () => void;
  setModal: (content: ModalContent | null) => void;
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

type PracticeFlowStep =
  | 'initializing'
  | 'speaking_intro' // For pranayama
  | 'intro_spoken_waiting_for_player' // For pranayama
  | 'player_active' // For pranayama
  | 'feedback'
  | 'completed_all_techniques'
  | 'meditation_intro_sequence'; // New for meditation intro

const PracticeStage: React.FC<PracticeStageProps> = ({
    userProfile, onCompleteStage, setModal,
    speak, listen, stopListening, cancelSpeech,
    isSpeaking, isListening,
    onScreenTap
}) => {
  const [sessionTechniques, setSessionTechniques] = useState<PranayamaTechnique[]>([]);
  const [currentTechniqueIndex, setCurrentTechniqueIndex] = useState(0);
  const [userFeedbackText, setUserFeedbackText] = useState('');
  const [currentShantiMessage, setCurrentShantiMessage] = useState("");
  const [currentFlowStep, setCurrentFlowStep] = useState<PracticeFlowStep>('initializing');
  const [meditationIntroStep, setMeditationIntroStep] = useState(0);

  const introSpeechAttemptedRef = useRef(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);


  useEffect(() => {
    if (currentFlowStep === 'initializing' && userProfile.experienceLevel) {
      if (userProfile.sessionIntent === 'meditation_introduction') {
        setCurrentFlowStep('meditation_intro_sequence');
        setMeditationIntroStep(0);
      } else { // Pranayama
        let applicableTechniques = Object.values(TECHNIQUES).filter(
            (tech) => userProfile.experienceLevel && tech.suitability[userProfile.experienceLevel]
        );
        // Add kid-specific filtering for pranayama if userType is KID
        if (userProfile.userType === UserType.KID) {
            // For now, let's assume kids can do Diaphragmatic and Bhramari, and shorter rounds
            // This logic would be more robust with kid-specific technique definitions
            applicableTechniques = applicableTechniques.filter(
                t => t.id === PranayamaTechniqueId.DIAPHRAGMATIC || t.id === PranayamaTechniqueId.BHRAMARI
            );
            // Modify rounds for kids - this is conceptual, actual technique data should reflect this
             applicableTechniques = applicableTechniques.map(tech => ({
                ...tech,
                rounds: {
                    ...tech.rounds,
                    [ExperienceLevel.BEGINNER]: Math.max(1, Math.floor((tech.rounds[ExperienceLevel.BEGINNER] || 3) / 2)),
                    [ExperienceLevel.INTERMEDIATE]: Math.max(1, Math.floor((tech.rounds[ExperienceLevel.INTERMEDIATE] || 4) / 2)),
                    [ExperienceLevel.ADVANCED]: Math.max(1, Math.floor((tech.rounds[ExperienceLevel.ADVANCED] || 5) / 2)),
                }
            }));

        }


        let techniquesToSet: PranayamaTechnique[] = [];

        if (userProfile.appTier === AppTier.LITE) {
            const dia = applicableTechniques.find(t => t.id === PranayamaTechniqueId.DIAPHRAGMATIC);
            const bhra = applicableTechniques.find(t => t.id === PranayamaTechniqueId.BHRAMARI);
            if (dia) techniquesToSet.push(dia);
            if (bhra && techniquesToSet.length < LITE_TIER_TECHNIQUE_LIMIT && !techniquesToSet.some(t => t.id === bhra.id)) {
                techniquesToSet.push(bhra);
            }
            if (techniquesToSet.length < LITE_TIER_TECHNIQUE_LIMIT) {
                applicableTechniques.forEach(t => {
                    if (techniquesToSet.length < LITE_TIER_TECHNIQUE_LIMIT && !techniquesToSet.some(existing => existing.id === t.id)) {
                        techniquesToSet.push(t);
                    }
                });
            }
            techniquesToSet = techniquesToSet.slice(0, LITE_TIER_TECHNIQUE_LIMIT);
        } else {
            if (userProfile.experienceLevel === ExperienceLevel.BEGINNER || userProfile.userType === UserType.KID) {
                techniquesToSet = applicableTechniques.filter(t => t.id === PranayamaTechniqueId.DIAPHRAGMATIC || t.id === PranayamaTechniqueId.BHRAMARI).slice(0, userProfile.userType === UserType.KID ? 1: 2);
            } else if (userProfile.experienceLevel === ExperienceLevel.INTERMEDIATE) {
                let intermediateTechniques = applicableTechniques.filter(t => t.id !== PranayamaTechniqueId.KAPALABHATI);
                 if (intermediateTechniques.length < 2 && applicableTechniques.some(t=>t.id === PranayamaTechniqueId.KAPALABHATI)) {
                    intermediateTechniques = applicableTechniques;
                }
                techniquesToSet = intermediateTechniques.slice(0, 2);
            } else {
                techniquesToSet = applicableTechniques.slice(0, 2);
            }
        }

        setSessionTechniques(techniquesToSet);
        setCurrentTechniqueIndex(0);
        introSpeechAttemptedRef.current = false;

        if (techniquesToSet.length > 0) {
          setCurrentFlowStep('speaking_intro');
        } else {
          const noTechMsg = "No suitable pranayama techniques found for this session. We'll move to the cool down.";
          setCurrentShantiMessage(noTechMsg);
          setCurrentFlowStep('completed_all_techniques');
        }
      }
    }
  }, [userProfile.experienceLevel, userProfile.appTier, userProfile.sessionIntent, userProfile.userType, currentFlowStep]);


  useEffect(() => {
    if (currentFlowStep === 'meditation_intro_sequence' && !isSpeaking) {
      const messages: (keyof typeof SHANTI_MESSAGES)[] = [
        "meditationIntroMain",
        "meditationIntroScience",
        "meditationIntroWalk",
        "meditationIntroKids",
        "meditationIntroConclusion"
      ];

      if (meditationIntroStep < messages.length) {
        const messageKey = messages[meditationIntroStep];
        setCurrentShantiMessage(SHANTI_MESSAGES[messageKey]);
        speak(SHANTI_MESSAGES[messageKey], () => {
          if (isMountedRef.current) setMeditationIntroStep(prev => prev + 1);
        });
      } else {
        // All meditation intro messages spoken
        if (isMountedRef.current) onCompleteStage();
      }
    }
  }, [currentFlowStep, meditationIntroStep, speak, isSpeaking, onCompleteStage]);


  useEffect(() => {
    if (currentFlowStep === 'speaking_intro' && !introSpeechAttemptedRef.current && sessionTechniques.length > 0 && !isSpeaking) {
      introSpeechAttemptedRef.current = true;
      let introMsg = SHANTI_MESSAGES.sessionStart;
      if (userProfile.userType === UserType.KID) {
          introMsg += " " + SHANTI_MESSAGES.kidsFocusMessageGeneral;
      }
      setCurrentShantiMessage(introMsg);
      speak(introMsg, () => {
        if(isMountedRef.current) {
            setTimeout(() => setCurrentFlowStep('intro_spoken_waiting_for_player'), 50);
        }
      });
    }
  }, [currentFlowStep, speak, isSpeaking, sessionTechniques.length, userProfile.userType]);

  useEffect(() => {
    if (currentFlowStep === 'intro_spoken_waiting_for_player') {
       if(isMountedRef.current) {
        setTimeout(() => setCurrentFlowStep('player_active'), 100);
       }
    }
  }, [currentFlowStep]);

  useEffect(() => {
    if (currentFlowStep === 'completed_all_techniques' && introSpeechAttemptedRef.current && userProfile.sessionIntent === 'pranayama') {
        const conclusionMessage = "That concludes our focused pranayama practice segment.";
        setCurrentShantiMessage(conclusionMessage);
        if(speak && !isSpeaking && isMountedRef.current) {
            speak(conclusionMessage, () => { if(isMountedRef.current) setTimeout(onCompleteStage, 50); });
        } else if (isMountedRef.current) {
            setTimeout(onCompleteStage, 50);
        }
    }
  }, [currentFlowStep, speak, isSpeaking, onCompleteStage, userProfile.sessionIntent]);


  const handleTechniqueComplete = useCallback((completedNormally: boolean) => {
    if (!isMountedRef.current) return;
    if(isListening) stopListening();

    setCurrentFlowStep('feedback');

    const feedbackPromptBase = SHANTI_MESSAGES.feedbackPrompt;
    const feedbackPrompt = feedbackPromptBase + (completedNormally ? "" : " You stopped the technique a bit early, which is perfectly fine. How are you feeling?");
    setCurrentShantiMessage(feedbackPrompt);

    const showFeedbackModal = () => {
        if(!isMountedRef.current) return;
        setModal({
          title: SHANTI_MESSAGES.modalReflectionTitle || "Practice Reflection",
          message: (
            <div>
              <p className="text-slate-700 mb-2">{feedbackPrompt}</p>
              <textarea
                value={userFeedbackText}
                onChange={(e) => setUserFeedbackText(e.target.value)}
                placeholder={SHANTI_MESSAGES.modalFeedbackPlaceholder || "How was that for you? (Optional)"}
                className="w-full p-2 mt-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-teal-500"
                rows={3}
                aria-label="Feedback input"
              />
            </div>
          ),
          actions: [
            { text: SHANTI_MESSAGES.modalSubmitFeedbackButton || "Submit Feedback", onClick: handleFeedbackSubmit, style: 'primary' }
          ]
        });
    };

    if (speak && !isSpeaking && isMountedRef.current) {
        speak(feedbackPrompt, () => { if(isMountedRef.current) setTimeout(showFeedbackModal, 50); });
    } else if (isMountedRef.current) {
        setTimeout(showFeedbackModal, 50);
    }
  }, [speak, isSpeaking, stopListening, isListening, setModal, userFeedbackText]);

  const handleFeedbackSubmit = useCallback(() => {
    if(!isMountedRef.current) return;
    console.log("User Feedback:", userFeedbackText);
    let thankYouMessage = "Thank you for your feedback.";

    if (userProfile.appTier === AppTier.FULL) {
        thankYouMessage += ` ${SHANTI_MESSAGES.premiumFeatureDescription.split('.')[0]}. Consider upgrading for deeper insights!`;
    } else if (userProfile.appTier === AppTier.PREMIUM) {
        thankYouMessage += " Shanti is considering your feedback for future personalized reflections.";
    }

    setCurrentShantiMessage(thankYouMessage);
    setModal(null);

    const proceedToNext = () => {
        if(!isMountedRef.current) return;
        setUserFeedbackText('');
        if (currentTechniqueIndex < sessionTechniques.length - 1) {
          setCurrentTechniqueIndex(prev => prev + 1);
          introSpeechAttemptedRef.current = false;

          const nextTechMsg = SHANTI_MESSAGES.nextTechnique;
          setCurrentShantiMessage(nextTechMsg);
          if(speak && !isSpeaking && isMountedRef.current) {
            speak(nextTechMsg, () => {
                 if(isMountedRef.current) setTimeout(() => setCurrentFlowStep('player_active'), 50);
            });
          } else if (isMountedRef.current) {
             setTimeout(() => setCurrentFlowStep('player_active'), 50);
          }

        } else {
          setCurrentFlowStep('completed_all_techniques');
        }
    };

    if (speak && !isSpeaking && isMountedRef.current) {
        speak(thankYouMessage, () => { if(isMountedRef.current) setTimeout(proceedToNext, 50); });
    } else if (isMountedRef.current) {
        setTimeout(proceedToNext, 50);
    }
  }, [userProfile.appTier, speak, isSpeaking, setModal, userFeedbackText, currentTechniqueIndex, sessionTechniques.length]);


  const handleIssueReported = useCallback((issue: string) => {
    if(!isMountedRef.current) return;
    console.warn("Issue reported in PracticeStage:", issue);

    if(isListening) stopListening();
    if(isSpeaking) cancelSpeech();

    const issueMessageBase = "I understand you might be experiencing some difficulty or have a question. Remember to always listen to your body. ";
    const safetyMsg = SHANTI_MESSAGES.safetyReminder;
    const fullIssueMessage = issueMessageBase + safetyMsg;
    setCurrentShantiMessage(fullIssueMessage);

    const showIssueModal = () => {
        if(!isMountedRef.current) return;
        setModal({
            title: SHANTI_MESSAGES.modalGuidanceTitle || "Guidance from Shanti",
            message: (
                <div>
                    <p className="mb-2">{fullIssueMessage}</p>
                    <p>Would you like to stop this technique, end the session, or try to continue carefully?</p>
                </div>
            ),
            actions: [
                { text: SHANTI_MESSAGES.modalContinueCarefullyButton || "Continue Carefully", onClick: () => {
                    if(!isMountedRef.current) return;
                    setModal(null);
                    if (speak && !isSpeaking && isMountedRef.current) speak("Alright, let's continue. Please be mindful.");
                }},
                { text: SHANTI_MESSAGES.modalStopTechniqueButton || "Stop Technique", onClick: () => {
                    if(!isMountedRef.current) return;
                    setModal(null);
                    const stopMsg = "Okay, we will stop this technique.";
                    if (speak && !isSpeaking && isMountedRef.current) {
                         speak(stopMsg, () => { if(isMountedRef.current) setTimeout(() => handleTechniqueComplete(false), 50); });
                    } else if (isMountedRef.current) {
                        setTimeout(() => handleTechniqueComplete(false), 50);
                    }
                }},
                { text: SHANTI_MESSAGES.modalEndSessionButton || "End Session Now", onClick: () => {
                    if(!isMountedRef.current) return;
                    setModal(null);
                    const endMsg = "Ending the practice session now.";
                    if(speak && !isSpeaking && isMountedRef.current) {
                        speak(endMsg, () => { if(isMountedRef.current) setTimeout(onCompleteStage, 50); });
                    } else if (isMountedRef.current) {
                        setTimeout(onCompleteStage, 50);
                    }
                }}
            ]
        });
    };

    if (speak && !isSpeaking && isMountedRef.current) {
        speak(fullIssueMessage, () => { if(isMountedRef.current) setTimeout(showIssueModal, 50); });
    } else if (isMountedRef.current) {
         setTimeout(showIssueModal, 50);
    }
  }, [speak, isSpeaking, stopListening, isListening, setModal, cancelSpeech, handleTechniqueComplete, onCompleteStage]);


  if (currentFlowStep === 'player_active' && sessionTechniques[currentTechniqueIndex] && userProfile && userProfile.experienceLevel) {
    const currentTechnique = sessionTechniques[currentTechniqueIndex];
    return (
      <PranayamaTechniquePlayer
        key={currentTechnique.id + '-' + currentTechniqueIndex}
        technique={currentTechnique}
        experienceLevel={userProfile.experienceLevel}
        userProfile={userProfile}
        onComplete={handleTechniqueComplete}
        onIssueReported={handleIssueReported}
        speak={speak}
        listen={listen}
        stopListening={stopListening}
        cancelSpeech={cancelSpeech}
        isSpeaking={isSpeaking}
        isListening={isListening}
        onScreenTap={onScreenTap}
      />
    );
  }

  // Display for meditation intro or initializing pranayama
  let displayMessage = currentShantiMessage;
  if (currentFlowStep === 'initializing' && userProfile.sessionIntent === 'pranayama') {
    displayMessage = "Initializing your pranayama session...";
  } else if (currentFlowStep === 'initializing' && userProfile.sessionIntent === 'meditation_introduction') {
     displayMessage = SHANTI_MESSAGES.meditationIntroMain; // Or a specific loading message
  } else if (currentFlowStep === 'speaking_intro') {
     displayMessage = currentShantiMessage || SHANTI_MESSAGES.sessionStart;
  }


  return (
    <div className="p-4 text-center">
      <ShantiSpeaks message={displayMessage} />
        {(userProfile?.appTier === AppTier.LITE && (currentFlowStep !== 'player_active' && currentFlowStep !== 'feedback')) && (
          <div className="mt-4 p-3 bg-sky-100 border border-sky-300 text-sky-700 rounded-md text-sm">
            <p>{SHANTI_MESSAGES.liteVersionPromptPractice}</p>
          </div>
        )}
        {currentFlowStep === 'meditation_intro_sequence' && (
            <div className="mt-4 p-4 bg-white/80 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold text-teal-700 mb-3" style={{fontFamily: "'Lora', serif"}}>
                    Introducing Meditation at GreyBrain.ai
                </h3>
                {/* Visual placeholder for meditation */}
                <div className="flex justify-center items-center h-48 bg-sky-100 rounded-lg my-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 17a1 1 0 011-1h6a1 1 0 110 2H9a1 1 0 01-1-1zM12 14a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM4 9a1 1 0 011-1h2a1 1 0 110 2H5a1 1 0 01-1-1z" />
                    </svg>
                </div>
                <p className="text-sm text-slate-600">Shanti is explaining the upcoming meditation features. Please listen.</p>
                {isSpeaking && <p className="mt-2 text-sky-600 animate-pulse">Shanti is speaking...</p>}
            </div>
        )}
    </div>
  );
};

export default PracticeStage;
