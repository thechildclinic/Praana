
export enum ExperienceLevel {
  BEGINNER = "Beginner (no prior experience)",
  INTERMEDIATE = "Intermediate (some experience)",
  ADVANCED = "Advanced (regular practice)",
}

export enum UserType {
  ADULT = "Adult",
  KID = "Child (under 16)"
}

export enum PranayamaTechniqueId {
  DIAPHRAGMATIC = "diaphragmatic",
  UJJAYI = "ujjayi",
  KAPALABHATI = "kapalabhati",
  ANULOM_VILOM = "anulom_vilom",
  BHRAMARI = "bhramari",
}

export interface TechniquePhase {
  type: 'instruction' | 'inhale' | 'exhale' | 'hold_in' | 'hold_out' | 'pause' | 'custom' | 'nostril_inhale_left' | 'nostril_exhale_right' | 'nostril_inhale_right' | 'nostril_exhale_left' | 'hum';
  text?: string;
  duration?: number;
  count?: number;
  details?: string;
}

export interface PranayamaTechnique {
  id: PranayamaTechniqueId;
  name: string;
  description: string;
  suitability: {
    [level in ExperienceLevel]?: boolean;
  };
  animationType: 'expand-contract' | 'glow' | 'pulse' | 'nostril-alternating' | 'ripple' | 'none';
  instructionalDiagramType: 'belly' | 'throat-sound' | 'forceful-exhale' | 'alternate-nostril' | 'humming-vibration' | 'none'; // New for instructional view
  initialInstruction: string;
  phases: TechniquePhase[];
  rounds: {
    [level in ExperienceLevel]?: number;
  };
  finalInstruction: string;
  benefits?: string[];
  contraindications?: string[];
}

export enum SessionStage {
  WELCOME = "welcome",
  HOW_TO_INTERACT = "how_to_interact",
  ACTIVITY_CHOICE = "activity_choice", // New stage for choosing Pranayama or Meditation Intro
  WARM_UP = "warm_up",
  PRACTICE = "practice", // Can be pranayama or a meditation intro message
  FEEDBACK = "feedback",
  COOL_DOWN = "cool_down",
  FAREWELL = "farewell",
}

export enum AppTier {
  LITE = "LITE",
  FULL = "FULL",
  PREMIUM = "PREMIUM"
}

export interface UserProfile {
  experienceLevel: ExperienceLevel | null;
  userType: UserType | null; // Added userType
  feelingStart: string;
  goals: string;
  usesBreathSensorConceptually?: boolean;
  appTier: AppTier;
  activationCode?: string;
  activationCodeType?: 'DEMO' | 'FULL';
  sessionsCompletedWithDemo?: number;
  demoSessionsLimit?: number;
  sessionIntent?: 'pranayama' | 'meditation_introduction' | null; // Added sessionIntent
}


export interface SessionLogEntry {
  speaker: "Shanti" | "System" | "User";
  message: string;
  timestamp: Date;
}

export interface ModalContent {
  title: string;
  message: string | React.ReactNode;
  actions?: { text: string; onClick: () => void; style?: 'primary' | 'secondary' }[];
}

// Voice Context Types
export type VoiceListeningState = "idle" | "listening" | "processing" | "error";

export interface VoiceContextType {
  isSupported: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  listeningState: VoiceListeningState;
  transcript: string;
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
  permissionStatus: 'prompt' | 'granted' | 'denied';
  requestPermission: () => void;
  speechBlocked: boolean;
  attemptToUnblockSpeech: () => void; // Added for handling speech blocking
}

// Common props for stages that can be advanced by tap
export interface StageControlProps {
   onAdvanceByTap?: () => void;
}

// --- Start of Web Speech API Type Definitions ---
export interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
  readonly error: SpeechRecognitionErrorCode;
  readonly message: string;
}

export interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
  readonly interpretation?: any;
  readonly emma?: Document | null;
}

export type SpeechRecognitionErrorCode =
  | 'no-speech'
  | 'aborted'
  | 'audio-capture'
  | 'network'
  | 'not-allowed'
  | 'service-not-allowed'
  | 'bad-grammar'
  | 'language-not-supported';

export interface SpeechGrammar {
  src: string;
  weight?: number;
}
declare var SpeechGrammar: {
  prototype: SpeechGrammar;
  new(): SpeechGrammar;
};

export interface SpeechGrammarList {
  readonly length: number;
  item(index: number): SpeechGrammar;
  [index: number]: SpeechGrammar;
  addFromString(string: string, weight?: number): void;
  addFromURI(src: string, weight?: number): void;
}

declare var SpeechGrammarList: {
  prototype: SpeechGrammarList;
  new(): SpeechGrammarList;
};
declare var webkitSpeechGrammarList: {
  prototype: SpeechGrammarList;
  new(): SpeechGrammarList;
};

export interface SpeechRecognitionEventMap {
  audiostart: Event;
  audioend: Event;
  end: Event;
  error: SpeechRecognitionErrorEvent;
  nomatch: SpeechRecognitionEvent;
  result: SpeechRecognitionEvent;
  soundstart: Event;
  soundend: Event;
  speechstart: Event;
  speechend: Event;
  start: Event;
}

export interface SpeechRecognition extends EventTarget {
  grammars: SpeechGrammarList;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  serviceURI?: string;

  onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

  abort(): void;
  start(): void;
  stop(): void;

  addEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof SpeechRecognitionEventMap>(
    type: K,
    listener: (this: SpeechRecognition, ev: SpeechRecognitionEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
} | undefined;

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
} | undefined;

declare global {
  interface Window {
    SpeechRecognition?: {
      prototype: SpeechRecognition;
      new(): SpeechRecognition;
    };
    webkitSpeechRecognition?: {
      prototype: SpeechRecognition;
      new(): SpeechRecognition;
    };
  }
}
// --- End of Web Speech API Type Definitions ---
