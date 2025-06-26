import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { SessionStage, UserProfile, ModalContent, StageControlProps, AppTier, UserType } from './types';
import { APP_NAME, SHANTI_MESSAGES, MOCK_VALID_ACTIVATION_CODE, MOCK_VALID_DEMO_CODE, DEMO_SESSIONS_LIMIT } from './constants';
import WelcomeStage from './components/WelcomeStage';
import HowToInteractStage from './components/HowToInteractStage';
import WarmUpStage from './components/WarmUpStage';
import PracticeStage from './components/PracticeStage';
import CoolDownStage from './components/CoolDownStage';
import FarewellStage from './components/FarewellStage';
import ModalDialog from './components/ModalDialog';
import ShantiSpeaks from './components/ShantiSpeaks';
import { VoiceProvider, useVoice } from './VoiceContext';
import VoiceControl from './components/VoiceControl';
import BrainIcon from './components/icons/BrainIcon';
import ActivationModal from './components/ActivationModal';
import { ThemeProvider } from './ThemeContext'; // Import ThemeProvider
import ThemeSwitcher from './components/ThemeSwitcher'; // Import ThemeSwitcher


// Placeholder for ActivityChoiceStage - will be created properly later
const ActivityChoiceStage: React.FC<{
  onComplete: (intent: 'pranayama' | 'meditation_introduction') => void;
  speak: (text: string, onEnd?: () => void) => void;
  listen: Function; stopListening: Function; isSpeaking: boolean;
  onAdvanceByTap?: () => void;
  userType: UserType | null;
}> = ({ onComplete, speak, listen, stopListening, isSpeaking, onAdvanceByTap, userType }) => {
  const [currentMessage, setCurrentMessage] = useState(SHANTI_MESSAGES.activityChoicePrompt);

  useEffect(() => {
    let message = SHANTI_MESSAGES.activityChoicePrompt;
    if (userType === UserType.KID) {
        message += " " + SHANTI_MESSAGES.kidsSpecificPlanMessage;
    }
    setCurrentMessage(message);
    if (!isSpeaking) {
      speak(message);
    }
  }, [speak, isSpeaking, userType]);

  const handleChoice = (intent: 'pranayama' | 'meditation_introduction') => {
    onComplete(intent);
  };
  
  useEffect(() => {
      if(onAdvanceByTap && !isSpeaking) {
          // Default to pranayama if tapped without specific choice logic for now
      }
  }, [onAdvanceByTap, isSpeaking]);


  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto text-center">
      <ShantiSpeaks message={currentMessage} />
      <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          onClick={() => handleChoice('pranayama')}
          className="px-6 py-3 bg-[var(--theme-action-primary-bg)] text-[var(--theme-action-primary-text)] font-medium rounded-lg shadow hover:bg-[var(--theme-action-primary-bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-highlight-focus)]"
        >
          {SHANTI_MESSAGES.activityChoicePranayamaButton}
        </button>
        <button
          onClick={() => handleChoice('meditation_introduction')}
          className="px-6 py-3 bg-[var(--theme-action-secondary-bg)] text-[var(--theme-action-secondary-text)] font-medium rounded-lg shadow hover:bg-[var(--theme-action-secondary-bg-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--theme-highlight-focus)]"
        >
          {SHANTI_MESSAGES.activityChoiceMeditationIntroButton}
        </button>
      </div>
      <p className="mt-4 text-xs text-[var(--theme-text-muted)]">Tap your choice or use voice commands if enabled.</p>
    </div>
  );
};


const MusicNoteIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm-2 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </svg>
);

const MainAppLayout: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<SessionStage>(SessionStage.WELCOME);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showActivationModal, setShowActivationModal] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  const {
    speak,
    listen,
    stopListening,
    cancelSpeech,
    isSupported,
    permissionStatus,
    requestPermission,
    isSpeaking,
    isListening,
    speechBlocked,
    attemptToUnblockSpeech
  } = useVoice();

  useEffect(() => {
    if (!userProfile) {
      handleUserProfileUpdate({ appTier: AppTier.LITE, userType: null, sessionIntent: null });
    }
  }, [userProfile]); 

  useEffect(() => {
    const audioEl = document.getElementById('background-music-player') as HTMLAudioElement;
    if (audioEl) {
      backgroundMusicRef.current = audioEl;
      backgroundMusicRef.current.src = "/assets/audio/calming-yoga-music.mp3"; 
      if (isMusicPlaying && backgroundMusicRef.current.paused && hasInteracted) {
        backgroundMusicRef.current.play().catch(e => console.warn("Music play failed initially:", e));
      } else if (!isMusicPlaying && !backgroundMusicRef.current.paused) {
        backgroundMusicRef.current.pause();
      }
    }
  }, [isMusicPlaying, hasInteracted]);

  const toggleMusic = () => {
    if (!hasInteracted) setHasInteracted(true); 
    setIsMusicPlaying(prev => {
        const newIsMusicPlaying = !prev;
        if (backgroundMusicRef.current) {
            if (newIsMusicPlaying && backgroundMusicRef.current.paused) {
                backgroundMusicRef.current.play().catch(e => console.warn("Music play failed on toggle:", e));
            } else if (!newIsMusicPlaying && !backgroundMusicRef.current.paused) {
                backgroundMusicRef.current.pause();
            }
        }
        return newIsMusicPlaying;
    });
  };

  const handleUserProfileUpdate = useCallback((profileUpdates: Partial<UserProfile>) => {
    setUserProfile(prev => ({
        experienceLevel: null,
        userType: null, 
        feelingStart: '',
        goals: '',
        usesBreathSensorConceptually: false,
        appTier: AppTier.LITE,
        sessionIntent: null, 
        ...prev,
        ...profileUpdates
    }));
  }, []);


  const handleRequestPermission = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);


  const handleWelcomeComplete = useCallback((profile: UserProfile) => {
    const completeProfile = { ...profile, appTier: userProfile?.appTier || AppTier.LITE, sessionIntent: null };
    handleUserProfileUpdate(completeProfile);
    setCurrentStage(SessionStage.HOW_TO_INTERACT);
  }, [userProfile, handleUserProfileUpdate]);

  const handleHowToInteractComplete = useCallback((profileUpdates: Partial<UserProfile>) => {
    handleUserProfileUpdate(profileUpdates);
    setCurrentStage(SessionStage.ACTIVITY_CHOICE); 
  }, [handleUserProfileUpdate]);

  const handleActivityChoiceComplete = useCallback((intent: 'pranayama' | 'meditation_introduction') => {
    handleUserProfileUpdate({ sessionIntent: intent });
    if (intent === 'pranayama') {
        setCurrentStage(SessionStage.WARM_UP);
    } else { 
        setCurrentStage(SessionStage.PRACTICE); 
    }
  }, [handleUserProfileUpdate]);


  const handleWarmUpComplete = useCallback(() => {
    setCurrentStage(SessionStage.PRACTICE);
  }, []);

  const handlePracticeComplete = useCallback(() => {
    setCurrentStage(SessionStage.COOL_DOWN);
  }, []);

  const handleCoolDownComplete = useCallback(() => {
    if (userProfile?.activationCodeType === 'DEMO' && userProfile.demoSessionsLimit !== undefined) {
      const newSessionsCompleted = (userProfile.sessionsCompletedWithDemo || 0) + 1;
      handleUserProfileUpdate({ sessionsCompletedWithDemo: newSessionsCompleted });

      if (newSessionsCompleted >= userProfile.demoSessionsLimit) {
        handleUserProfileUpdate({
          appTier: AppTier.LITE,
          activationCodeType: undefined,
          sessionsCompletedWithDemo: undefined,
          demoSessionsLimit: undefined,
        });
        setModalContent({
          title: SHANTI_MESSAGES.demoExpiredTitle,
          message: SHANTI_MESSAGES.demoExpiredMessage,
          actions: [
            { text: SHANTI_MESSAGES.purchaseAfterDemoButton, 
              onClick: () => {
                setModalContent(null);
                setShowActivationModal(true);
              },
              style: 'primary' 
            },
            { text: "Continue with Lite", onClick: () => setModalContent(null), style: 'secondary' }
          ]
        });
        setCurrentStage(SessionStage.FAREWELL);
      } else {
        setCurrentStage(SessionStage.FAREWELL);
      }
    } else {
      setCurrentStage(SessionStage.FAREWELL);
    }
  }, [userProfile, handleUserProfileUpdate]);

  const handleEndSession = useCallback(() => {
    setUserProfile(prev => prev ? ({
      ...prev,
      experienceLevel: null,
      userType: null,
      feelingStart: '',
      goals: '',
      usesBreathSensorConceptually: false,
      sessionIntent: null,
    }) : null);
    setCurrentStage(SessionStage.WELCOME);
  }, []);

  const handleActivation = useCallback((code: string) => {
    if (code === MOCK_VALID_ACTIVATION_CODE) {
      handleUserProfileUpdate({ appTier: AppTier.FULL, activationCode: code, activationCodeType: 'FULL' });
      setModalContent({ title: "Activation Successful", message: SHANTI_MESSAGES.activationSuccessFull, actions: [{ text: "OK", onClick: () => setModalContent(null) }] });
    } else if (code === MOCK_VALID_DEMO_CODE) {
      handleUserProfileUpdate({ appTier: AppTier.FULL, activationCode: code, activationCodeType: 'DEMO', demoSessionsLimit: DEMO_SESSIONS_LIMIT, sessionsCompletedWithDemo: 0 });
      const message = SHANTI_MESSAGES.activationSuccessDemo.replace('{limit}', String(DEMO_SESSIONS_LIMIT));
      setModalContent({ title: "Demo Activated", message: message, actions: [{ text: "OK", onClick: () => setModalContent(null) }] });
    } else {
      setModalContent({ title: "Activation Failed", message: SHANTI_MESSAGES.activationErrorInvalidCode, actions: [{ text: "Try Again", onClick: () => setModalContent(null) }] });
      return; 
    }
    setShowActivationModal(false);
  }, [handleUserProfileUpdate]);


  const globalTapHandler = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      console.log("App.tsx: First user interaction detected by globalTapHandler.");
    }

    let musicPlayAttemptedAndFailed = false;

    if (backgroundMusicRef.current && backgroundMusicRef.current.paused && isMusicPlaying) {
      console.log("App.tsx: Global tap - Attempting to play background music.");
      backgroundMusicRef.current.play()
        .then(() => {
          console.log("App.tsx: Background music successfully started via global tap.");
        })
        .catch(e => {
          console.warn("App.tsx: Background music play on global tap failed:", e);
          musicPlayAttemptedAndFailed = true;
          if (speechBlocked && !isSpeaking) {
            console.log("App.tsx: Music play failed & speech blocked, trying speech primer.");
            attemptToUnblockSpeech();
          }
        });
    }

    if (speechBlocked && !isSpeaking && !musicPlayAttemptedAndFailed) {
      console.log("App.tsx: Global tap - Speech blocked. Trying speech primer.");
      attemptToUnblockSpeech();
    }
    
    if (permissionStatus === 'prompt') {
        console.log("App.tsx: Global tap - Microphone permission is 'prompt'. Requesting permission.");
        handleRequestPermission();
    }

  }, [
    hasInteracted, speechBlocked, isSpeaking, attemptToUnblockSpeech,
    backgroundMusicRef, isMusicPlaying, permissionStatus, handleRequestPermission
  ]);


  const renderStage = () => {
    if (!userProfile) { 
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-[var(--theme-bg-page)]">
                <BrainIcon className="w-16 h-16 text-[var(--theme-icon-brain)] mb-4 animate-pulse" />
                <p className="text-xl text-[var(--theme-text-heading)]" style={{ fontFamily: "'Lora', serif" }}>Initializing {APP_NAME} by GreyBrain.ai...</p>
            </div>
        );
    }
    
    const handleScreenTapForAdvancement = () => {
      if (modalContent || isSpeaking || isListening) return;
    };


    switch (currentStage) {
      case SessionStage.WELCOME:
        return <WelcomeStage
                  onComplete={handleWelcomeComplete}
                  onProfileUpdate={handleUserProfileUpdate}
                  speak={speak} listen={listen} stopListening={stopListening} isSpeaking={isSpeaking}
                  appTier={userProfile.appTier}
                  onAdvanceByTap={handleScreenTapForAdvancement}
                />;
      case SessionStage.HOW_TO_INTERACT:
        return <HowToInteractStage
                  onComplete={handleHowToInteractComplete}
                  speak={speak} listen={listen} stopListening={stopListening} isSpeaking={isSpeaking}
                  appTier={userProfile.appTier}
                  onAdvanceByTap={handleScreenTapForAdvancement}
                />;
      case SessionStage.ACTIVITY_CHOICE:
        return <ActivityChoiceStage
                  onComplete={handleActivityChoiceComplete}
                  speak={speak} listen={listen} stopListening={stopListening} isSpeaking={isSpeaking}
                  userType={userProfile.userType}
                  onAdvanceByTap={handleScreenTapForAdvancement}
                />;
      case SessionStage.WARM_UP:
        return <WarmUpStage onComplete={handleWarmUpComplete} speak={speak} />;
      case SessionStage.PRACTICE:
        if (!userProfile.experienceLevel && userProfile.sessionIntent === 'pranayama') { 
            setCurrentStage(SessionStage.WELCOME); 
            return <ShantiSpeaks message={SHANTI_MESSAGES.cannotCompleteWelcomeMissingExperience} />;
        }
        return <PracticeStage
                  userProfile={userProfile}
                  onCompleteStage={handlePracticeComplete}
                  setModal={setModalContent}
                  speak={speak} listen={listen} stopListening={stopListening} cancelSpeech={cancelSpeech}
                  isSpeaking={isSpeaking} isListening={isListening}
                  onScreenTap={handleScreenTapForAdvancement} 
                />;
      case SessionStage.COOL_DOWN:
        return <CoolDownStage onComplete={handleCoolDownComplete} speak={speak} />;
      case SessionStage.FAREWELL:
        return <FarewellStage
                  onEndSession={handleEndSession}
                  speak={speak} listen={listen} stopListening={stopListening} isSpeaking={isSpeaking}
                  appTier={userProfile.appTier}
                  onAdvanceByTap={handleScreenTapForAdvancement}
                />;
      default:
        return <ShantiSpeaks message="Loading..." />;
    }
  };

  const appTierDisplayName = userProfile?.appTier === AppTier.FULL && userProfile.activationCodeType === 'DEMO'
    ? `Demo (${(userProfile.demoSessionsLimit || 0) - (userProfile.sessionsCompletedWithDemo || 0)} left)`
    : userProfile?.appTier || AppTier.LITE;


  return (
    <div className="min-h-screen bg-[var(--theme-bg-page)] text-[var(--theme-text-body)] flex flex-col items-center justify-center pt-16 pb-20 px-2"
        onClick={globalTapHandler} role="main" aria-label={`${APP_NAME} Main Application Area`}
    >
      <header className="fixed top-0 left-0 right-0 bg-[var(--theme-bg-header)] text-[var(--theme-text-on-header)] p-3 shadow-lg z-40 flex justify-between items-center backdrop-blur-md bg-opacity-90">
        <div className="flex items-center">
            <BrainIcon className="w-7 h-7 mr-2 text-[var(--theme-icon-brain-header)]" />
            <h1 className="text-xl font-semibold" style={{fontFamily: "'Lora', serif"}}>{APP_NAME} <span className="text-xs font-light opacity-80">by GreyBrain.ai</span></h1>
            <span className="ml-3 text-xs bg-[var(--theme-highlight-subtle)] text-[var(--theme-text-heading)] px-2 py-0.5 rounded-full font-medium shadow-sm">
                {appTierDisplayName}
            </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
             <ThemeSwitcher />
             {userProfile?.appTier === AppTier.LITE && (
                <button
                    onClick={(e) => { e.stopPropagation(); setShowActivationModal(true);}}
                    className="px-3 py-1.5 text-xs bg-[var(--theme-action-primary-bg)] hover:bg-[var(--theme-action-primary-bg-hover)] text-[var(--theme-action-primary-text)] rounded-md shadow-sm font-medium transition-colors"
                >
                    {SHANTI_MESSAGES.activateFullVersionButton}
                </button>
            )}
            <div onClick={e => e.stopPropagation()}><VoiceControl /></div>
            <button
                onClick={(e) => { e.stopPropagation(); toggleMusic();}}
                title={isMusicPlaying ? "Pause Background Music" : "Play Background Music"}
                className="p-2.5 rounded-full bg-black/10 hover:bg-black/20 focus:outline-none focus:ring-2 ring-[var(--theme-highlight-focus)] ring-offset-2 ring-offset-[var(--theme-bg-header)] transition-colors"
                aria-label={isMusicPlaying ? "Pause music" : "Play music"}
            >
                <MusicNoteIcon className={`w-5 h-5 ${isMusicPlaying ? 'text-[var(--theme-icon-light)]' : 'text-[var(--theme-icon-muted)]'}`} />
            </button>
        </div>
      </header>

      <main className="w-full max-w-2xl bg-[var(--theme-bg-card)] bg-opacity-80 backdrop-blur-sm rounded-xl shadow-2xl p-3 md:p-5 mt-4 mb-4 overflow-y-auto flex-grow">
        {renderStage()}
      </main>
      
      <ModalDialog isOpen={!!modalContent} onClose={() => setModalContent(null)} content={modalContent} />
      <ActivationModal isOpen={showActivationModal} onClose={() => setShowActivationModal(false)} onActivate={handleActivation} />

      <footer className="fixed bottom-0 left-0 right-0 bg-[var(--theme-bg-footer)] text-[var(--theme-text-on-footer)] p-2 text-center text-xs shadow-top z-40 backdrop-blur-md bg-opacity-90">
        <p>{SHANTI_MESSAGES.footerSafetyReminder}</p>
        {!isSupported && <p className="text-yellow-300">Voice interaction not fully supported by this browser.</p>}
        {permissionStatus === 'denied' && <p className="text-yellow-300">Microphone access denied. Voice features disabled.</p>}
        {speechBlocked &&
            <div className="p-2 bg-yellow-400 text-yellow-900 rounded-md my-1 text-xs">
                Shanti's voice might be blocked. Tap screen/button to enable.
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    console.log("Footer unblock button clicked.");
                    attemptToUnblockSpeech(); 
                  }} 
                  className="ml-2 underline font-semibold"
                >
                  Try Unblock
                </button>
            </div>
        }
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <VoiceProvider>
        <MainAppLayout />
      </VoiceProvider>
    </ThemeProvider>
  );
};

export default App;