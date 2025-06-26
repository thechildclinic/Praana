
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  VoiceContextType,
  VoiceListeningState,
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent,
} from '../types';

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: React.ReactNode;
}

interface BlockedSpeechDetails {
  text: string;
  onEnd?: () => void;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [listeningState, setListeningState] = useState<VoiceListeningState>("idle");
  const [transcript, setTranscript] = useState('');
  const [speechBlocked, setSpeechBlocked] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechSynthesisAPI = useRef<SpeechSynthesis | null>(null);
  const onEndCallbackRef = useRef<(() => void) | null | undefined>(null);
  const lastBlockedSpeechRef = useRef<BlockedSpeechDetails | null>(null);
  const userInteractionConfirmedBySpeechStartRef = useRef(false);


  useEffect(() => {
    const SrAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    speechSynthesisAPI.current = window.speechSynthesis;

    if (SrAPI && speechSynthesisAPI.current) {
      setIsSupported(true);
      recognitionRef.current = new SrAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      if (navigator.permissions) {
        navigator.permissions.query({ name: 'microphone' as PermissionName }).then(status => {
          setPermissionStatus(status.state);
          status.onchange = () => setPermissionStatus(status.state);
        }).catch(err => {
            console.warn("Permission API for microphone query failed:", err);
            setPermissionStatus('prompt');
        });
      }
    } else {
      setIsSupported(false);
      console.warn("Speech Recognition or Synthesis not supported.");
    }
    return () => {
        if (speechSynthesisAPI.current) {
            speechSynthesisAPI.current.cancel();
        }
    };
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!speechSynthesisAPI.current || !text) {
      console.warn("VoiceContext: Speak called but synthesis API not ready or text empty.");
      if (onEnd) setTimeout(onEnd, 50);
      return;
    }

    if (!userInteractionConfirmedBySpeechStartRef.current &&
        speechSynthesisAPI.current &&
        !speechSynthesisAPI.current.speaking &&
        !speechSynthesisAPI.current.pending) {
      console.log(`VoiceContext: Proactively queuing initial speech "${text.substring(0,30)}" as user interaction not yet confirmed by speech start. Setting speechBlocked.`);
      lastBlockedSpeechRef.current = { text, onEnd };
      setSpeechBlocked(true); // Simulate blockage to engage unblock logic on interaction
      // Original onEnd is suppressed for this proactive block.
      return;
    }

    if (speechBlocked) {
      if (lastBlockedSpeechRef.current && lastBlockedSpeechRef.current.text === text) {
        console.log("VoiceContext: Speak called for a message that is already blocked and pending retry. Ignoring redundant call for:", text.substring(0,30));
        return;
      }
      console.warn(`VoiceContext: Speak called for "${text.substring(0,30)}" but speech is blocked. Storing, original onEnd is suppressed.`);
      lastBlockedSpeechRef.current = { text, onEnd };
      return;
    }

    if (lastBlockedSpeechRef.current && lastBlockedSpeechRef.current.text !== text) {
        console.log("VoiceContext: New speak request (speech not blocked), clearing previously blocked speech details for different text:", lastBlockedSpeechRef.current.text.substring(0,30));
        lastBlockedSpeechRef.current = null;
    }

    if (speechSynthesisAPI.current) {
        speechSynthesisAPI.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    onEndCallbackRef.current = onEnd;

    setIsSpeaking(true);

    utterance.onstart = () => {
      console.log("VoiceContext: Utterance started, confirming user interaction has occurred.", text.substring(0,30));
      userInteractionConfirmedBySpeechStartRef.current = true;
      // Any other onstart logic if needed
    };

    utterance.onend = () => {
      console.log("VoiceContext: Utterance ended:", text.substring(0,30));
      if (utteranceRef.current === utterance) {
        setIsSpeaking(false);
        // setSpeechBlocked(false); // Only set to false if it was a successful end, error handler handles its case.
                                  // Successful .onend implies not blocked.
        if (speechBlocked && userInteractionConfirmedBySpeechStartRef.current) {
             // If speech was blocked but somehow this utterance ended successfully (e.g. after a retry)
             setSpeechBlocked(false);
        }

        const callback = onEndCallbackRef.current;
        utteranceRef.current = null;
        onEndCallbackRef.current = null;
        if (callback) {
          setTimeout(callback, 50);
        }
      } else {
        console.log("VoiceContext: onEnd for a stale/cancelled utterance ignored.");
      }
    };

    utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
      const utteranceText = event.utterance?.text.substring(0, 50) || "N/A";
      console.error(`VoiceContext: SpeechSynthesis Error. Code: ${event.error} for text: '${utteranceText}...'`);

      if (utteranceRef.current === event.utterance) {
        setIsSpeaking(false);
        const errorType = event.error as string;
        let shouldCallOnEnd = true;

        if (errorType === 'not-allowed' || errorType === 'blocked' || errorType === 'audio-busy') {
          setSpeechBlocked(true);
          lastBlockedSpeechRef.current = { text: event.utterance.text, onEnd: onEndCallbackRef.current };
          console.warn(`VoiceContext: Speech was ${errorType}. User interaction may be needed. Stored for retry. Original onEnd suppressed for this attempt.`);
          shouldCallOnEnd = false;
        } else {
          // For other errors, ensure speechBlocked reflects reality if an error implies it.
          // e.g. 'synthesis-failed' might mean it's not globally blocked but this one failed.
          // For now, only 'not-allowed' types aggressively set speechBlocked.
        }

        const callback = onEndCallbackRef.current;
        utteranceRef.current = null;
        onEndCallbackRef.current = null;

        if (shouldCallOnEnd && callback) {
            console.log(`VoiceContext: Calling onEndCallback due to speech error (type: ${errorType}) to maintain flow.`);
            setTimeout(callback, 50);
        }
      } else {
        console.log("VoiceContext: onError for a stale/cancelled utterance ignored.");
      }
    };

    console.log("VoiceContext: Speaking:", text.substring(0,30));
    speechSynthesisAPI.current.speak(utterance);

  }, [speechBlocked]);


  const requestPermission = useCallback(async () => {
    if (!isSupported) return;
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionStatus('granted');
      // If permission is granted, it's a strong user interaction.
      // We can try to unblock speech if it was blocked or pending.
      // attemptToUnblockSpeech itself will check speechBlocked and lastBlockedSpeechRef.
      console.log("VoiceContext: Microphone permission newly granted. Attempting to unblock/prime speech.");
      attemptToUnblockSpeech();
      
    } catch (err) {
      console.error("Error requesting microphone permission:", err);
      setPermissionStatus('denied');
    }
  }, [isSupported]); // attemptToUnblockSpeech will be defined below, so can be added if needed, but it's stable


  const attemptToUnblockSpeech = useCallback(() => {
    if (!speechSynthesisAPI.current) {
        console.warn("VoiceContext: attemptToUnblockSpeech - synthesis API not ready.");
        return;
    }

    // Scenario 1: Speech not marked as blocked, but a message was stored (e.g., proactive queueing)
    if (!speechBlocked && lastBlockedSpeechRef.current) {
        console.log("VoiceContext: attemptToUnblockSpeech - speech not currently marked blocked, but a stored message exists. Retrying directly:", lastBlockedSpeechRef.current.text.substring(0,30));
        const { text, onEnd: originalOnEnd } = lastBlockedSpeechRef.current;
        lastBlockedSpeechRef.current = null;

        speechSynthesisAPI.current.cancel();
        const utteranceToRetry = new SpeechSynthesisUtterance(text);
        utteranceRef.current = utteranceToRetry;
        onEndCallbackRef.current = originalOnEnd;
        setIsSpeaking(true);

        utteranceToRetry.onstart = () => {
            console.log("VoiceContext: Retried utterance (scenario 1) started, confirming user interaction.", text.substring(0,30));
            userInteractionConfirmedBySpeechStartRef.current = true;
        };
        utteranceToRetry.onend = () => {
            console.log("VoiceContext: Directly retried (from scenario 1) utterance ended:", text.substring(0,30));
            if (utteranceRef.current === utteranceToRetry) {
                setIsSpeaking(false);
                setSpeechBlocked(false);
                const callback = onEndCallbackRef.current;
                utteranceRef.current = null;
                onEndCallbackRef.current = null;
                if (callback) setTimeout(callback, 50);
            }
        };
        utteranceToRetry.onerror = (event: SpeechSynthesisErrorEvent) => {
            const errorText = event.utterance?.text.substring(0,50) || "N/A";
            console.error(`VoiceContext: Directly retried (from scenario 1) SpeechSynthesis Error. Code: ${event.error} for text: '${errorText}...'`);
            if (utteranceRef.current === utteranceToRetry) {
                setIsSpeaking(false);
                const errorType = event.error as string;
                if (errorType === 'not-allowed' || errorType === 'blocked' || errorType === 'audio-busy') {
                    setSpeechBlocked(true);
                    lastBlockedSpeechRef.current = { text: event.utterance.text, onEnd: onEndCallbackRef.current };
                }
                const callback = onEndCallbackRef.current;
                utteranceRef.current = null;
                onEndCallbackRef.current = null;
                if (callback) {
                     console.log(`VoiceContext: Calling original onEnd for directly retried utterance (status: ${errorType}) to maintain app flow.`);
                     setTimeout(callback, 50);
                }
            }
        };
        speechSynthesisAPI.current.speak(utteranceToRetry);
        return;
    }

    // Scenario 2: Speech is actively marked as blocked (either from API error or proactive set)
    if (speechBlocked) {
        console.log("VoiceContext: attemptToUnblockSpeech - speech is actively blocked. Playing primer.");
        speechSynthesisAPI.current.cancel();
        const primer = new SpeechSynthesisUtterance("audio check");
        primer.volume = 0.01;
        primer.rate = 10;
        primer.pitch = 0;

        let unblockAttemptSuccessfulViaPrimerStart = false;

        primer.onstart = () => {
            console.log("VoiceContext: Speech unblock primer started.");
            unblockAttemptSuccessfulViaPrimerStart = true;
            userInteractionConfirmedBySpeechStartRef.current = true;
        };

        primer.onend = () => {
            if (utteranceRef.current === primer) utteranceRef.current = null; // Clear primer from current utterance
            if (unblockAttemptSuccessfulViaPrimerStart) {
                console.log("VoiceContext: Speech unblock primer ended successfully.");
                setSpeechBlocked(false);

                if (lastBlockedSpeechRef.current) {
                    console.log("VoiceContext: Primer successful, directly speaking stored blocked speech:", lastBlockedSpeechRef.current.text.substring(0,30));
                    const { text, onEnd: originalOnEnd } = lastBlockedSpeechRef.current;
                    lastBlockedSpeechRef.current = null;

                    if (speechSynthesisAPI.current) {
                        speechSynthesisAPI.current.cancel();
                        const utteranceToRetry = new SpeechSynthesisUtterance(text);
                        utteranceRef.current = utteranceToRetry;
                        onEndCallbackRef.current = originalOnEnd;
                        setIsSpeaking(true);

                        utteranceToRetry.onstart = () => {
                            console.log("VoiceContext: Retried utterance (after primer) started, confirming user interaction.", text.substring(0,30));
                            userInteractionConfirmedBySpeechStartRef.current = true;
                        };
                        utteranceToRetry.onend = () => {
                            console.log("VoiceContext: Retried utterance (after primer) ended:", text.substring(0,30));
                            if (utteranceRef.current === utteranceToRetry) {
                                setIsSpeaking(false);
                                setSpeechBlocked(false);
                                const callback = onEndCallbackRef.current;
                                utteranceRef.current = null;
                                onEndCallbackRef.current = null;
                                if (callback) setTimeout(callback, 50);
                            }
                        };
                        utteranceToRetry.onerror = (event: SpeechSynthesisErrorEvent) => {
                            const errorText = event.utterance?.text.substring(0,50) || "N/A";
                            console.error(`VoiceContext: Retried (after primer) SpeechSynthesis Error. Code: ${event.error} for text: '${errorText}...'`);
                            if (utteranceRef.current === utteranceToRetry) {
                                setIsSpeaking(false);
                                const errorType = event.error as string;
                                if (errorType === 'not-allowed' || errorType === 'blocked' || errorType === 'audio-busy') {
                                    setSpeechBlocked(true);
                                    lastBlockedSpeechRef.current = { text: event.utterance.text, onEnd: onEndCallbackRef.current };
                                }
                                const callback = onEndCallbackRef.current;
                                utteranceRef.current = null;
                                onEndCallbackRef.current = null;
                                if (callback) {
                                    console.log(`VoiceContext: Calling original onEnd for retried utterance (status: ${errorType}) to maintain app flow.`);
                                    setTimeout(callback, 50);
                                }
                            }
                        };
                        speechSynthesisAPI.current.speak(utteranceToRetry);
                    } else {
                         console.error("VoiceContext: Synthesis API became unavailable after primer success?");
                         if (originalOnEnd) setTimeout(originalOnEnd, 50);
                    }
                } else {
                    console.log("VoiceContext: Primer successful, speech unblocked, but no specific message was stored to replay.");
                }
            } else {
                 console.warn("VoiceContext: Speech unblock primer 'onend' called, but 'onstart' was not. Speech might still be blocked.");
                 // If primer onstart didn't fire, speechBlocked remains true.
            }
        };

        primer.onerror = (e) => {
            if (utteranceRef.current === primer) utteranceRef.current = null;
            console.warn("VoiceContext: Speech unblock primer error:", e.error, ". Speech remains blocked.");
            // speechBlocked remains true. lastBlockedSpeechRef still holds the message.
            // Consider if the original onEnd of the blocked message should be called here to prevent app hanging indefinitely.
            // For now, it will wait for another interaction.
        };
        
        utteranceRef.current = primer;
        speechSynthesisAPI.current.speak(primer);
        return;
    }

    console.log("VoiceContext: attemptToUnblockSpeech - speech not blocked and no pending message. No action needed.");

  }, [speechBlocked]);

  const cancelSpeech = useCallback(() => {
    if (speechSynthesisAPI.current) {
      console.log("VoiceContext: cancelSpeech called.");
      speechSynthesisAPI.current.cancel();
      // When speech is cancelled, the 'onend' event of the current utterance usually fires.
      // The logic within onend (checking if utteranceRef.current === utterance) handles
      // preventing callbacks for cancelled utterances if utteranceRef.current is cleared.
      if (isSpeaking || utteranceRef.current) {
        setIsSpeaking(false);
        utteranceRef.current = null; // Ensure no stale reference
        // Do not call onEndCallbackRef.current here; let the natural onend/onerror due to cancel handle it or not.
      }
    }
  }, [isSpeaking]);


  const listen = useCallback((
    onResultCallback: (transcript: string) => void,
    onStartCallback?: () => void,
    onEndCallback?: () => void,
    onErrorCallback?: (error: string) => void,
    options?: { continuous?: boolean, interimResults?: boolean }
  ) => {
    if (!recognitionRef.current || permissionStatus !== 'granted') {
        const errorMsg = permissionStatus !== 'granted' ? "Mic permission not granted." : "Speech recognition N/A.";
        console.warn("VoiceContext: Listen aborted.", errorMsg);
        if (onErrorCallback) onErrorCallback(errorMsg);
        if (onEndCallback) setTimeout(onEndCallback, 50);
        setListeningState("idle"); setIsListening(false);
        return;
    }

    if (isSpeaking && speechSynthesisAPI.current) {
        console.log("VoiceContext: Listen called while speaking, cancelling speech first.");
        // cancelSpeech(); // Already called by the line below effectively
        speechSynthesisAPI.current.cancel(); // This will trigger onend/onerror for the current utterance
        setIsSpeaking(false); // Ensure state consistency
        if(utteranceRef.current) utteranceRef.current = null; // Clear current utterance
        if(onEndCallbackRef.current) onEndCallbackRef.current = null; // Clear its callback
    }


    if (isListening) {
        console.warn("VoiceContext: Listen called while already listening. Aborting previous recognition instance.");
        recognitionRef.current.abort(); // This will trigger onend for the old recognition
    }

    setIsListening(true);
    setListeningState("listening");
    setTranscript('');

    recognitionRef.current.continuous = options?.continuous ?? false;
    recognitionRef.current.interimResults = options?.interimResults ?? false;

    if (onStartCallback) onStartCallback();

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
        onResultCallback(finalTranscript);
      }
    };

    recognitionRef.current.onend = () => {
      console.log("VoiceContext: SpeechRecognition service ended.");
      // Check if we are still supposed to be listening (e.g. if continuous is false, this is normal)
      // The setIsListening(false) should be managed carefully if continuous=true and it ends unexpectedly.
      // For now, assuming onend means it's done for this listen() call.
      if (listeningState !== "idle") { // only update if not already reset by stopListening or error
         setIsListening(false);
         setListeningState("idle");
      }
      if (onEndCallback) setTimeout(onEndCallback, 50);
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error(`VoiceContext: SpeechRecognition Error. Type: ${event.error}`, event.message);
       if (listeningState !== "idle") {
          setIsListening(false);
          setListeningState("error");
      }
      if (onErrorCallback) onErrorCallback(event.error);
      // Ensure onEndCallback is also called on error, as per typical Web API eventing
      if (onEndCallback) setTimeout(onEndCallback, 50);
    };

    try {
        console.log("VoiceContext: Attempting to start speech recognition.");
        recognitionRef.current.start();
    } catch (e: any) {
        console.error("VoiceContext: Error executing recognition.start():", e.name, e.message);
        if (listeningState !== "idle") {
            setIsListening(false);
            setListeningState("error");
        }
        if (onErrorCallback) onErrorCallback(e.name === 'InvalidStateError' ? "Recognition already started or in invalid state." : e.message);
        if (onEndCallback) setTimeout(onEndCallback, 50);
    }
  }, [permissionStatus, isSpeaking, isListening, listeningState]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      console.log("VoiceContext: stopListening called.");
      recognitionRef.current.stop(); // This will trigger recognition.onend
    }
    // Explicitly set state in case stop() is called when not actively listening or if .stop() doesn't fire onend quickly
    setIsListening(false);
    setListeningState("idle");
  }, [isListening]);


  const contextValue: VoiceContextType = {
    isSupported,
    permissionStatus,
    requestPermission,
    isListening,
    isSpeaking,
    listeningState,
    transcript,
    speak,
    listen,
    stopListening,
    cancelSpeech,
    speechBlocked,
    attemptToUnblockSpeech,
  };

  return <VoiceContext.Provider value={contextValue}>{children}</VoiceContext.Provider>;
};
