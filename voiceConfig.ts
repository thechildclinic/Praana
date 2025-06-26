import { VoiceProfile, LanguageOption, VoiceCommand } from './types';

// Voice Profiles with different personalities for Shanti
export const VOICE_PROFILES: VoiceProfile[] = [
  {
    id: 'shanti-gentle',
    name: 'Shanti (Gentle)',
    description: 'Soft, calming voice perfect for meditation',
    personality: 'gentle',
    preferredLang: 'en-US',
    rate: 0.8,
    pitch: 1.1,
    volume: 0.9
  },
  {
    id: 'shanti-warm',
    name: 'Shanti (Warm)',
    description: 'Warm, nurturing voice for comfort',
    personality: 'warm',
    preferredLang: 'en-US',
    rate: 0.9,
    pitch: 1.0,
    volume: 0.95
  },
  {
    id: 'shanti-clear',
    name: 'Shanti (Clear)',
    description: 'Clear, articulate voice for instructions',
    personality: 'clear',
    preferredLang: 'en-US',
    rate: 1.0,
    pitch: 0.9,
    volume: 1.0
  },
  {
    id: 'shanti-soothing',
    name: 'Shanti (Soothing)',
    description: 'Extra soothing voice for deep relaxation',
    personality: 'soothing',
    preferredLang: 'en-US',
    rate: 0.7,
    pitch: 1.2,
    volume: 0.85
  },
  {
    id: 'shanti-energetic',
    name: 'Shanti (Energetic)',
    description: 'More energetic voice for active sessions',
    personality: 'energetic',
    preferredLang: 'en-US',
    rate: 1.1,
    pitch: 0.95,
    volume: 1.0
  }
];

// Supported Languages including Indian languages
export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    flag: '🇺🇸',
    speechLang: 'en-US',
    voiceLang: 'en-US'
  },
  {
    code: 'en-GB',
    name: 'English (UK)',
    nativeName: 'English',
    flag: '🇬🇧',
    speechLang: 'en-GB',
    voiceLang: 'en-GB'
  },
  {
    code: 'en-IN',
    name: 'English (India)',
    nativeName: 'English',
    flag: '🇮🇳',
    speechLang: 'en-IN',
    voiceLang: 'en-IN'
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    speechLang: 'hi-IN',
    voiceLang: 'hi-IN'
  },
  {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    flag: '🇮🇳',
    speechLang: 'ta-IN',
    voiceLang: 'ta-IN'
  },
  {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    flag: '🇮🇳',
    speechLang: 'te-IN',
    voiceLang: 'te-IN'
  },
  {
    code: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    flag: '🇮🇳',
    speechLang: 'bn-IN',
    voiceLang: 'bn-IN'
  },
  {
    code: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
    speechLang: 'mr-IN',
    voiceLang: 'mr-IN'
  },
  {
    code: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    flag: '🇮🇳',
    speechLang: 'gu-IN',
    voiceLang: 'gu-IN'
  },
  {
    code: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    speechLang: 'kn-IN',
    voiceLang: 'kn-IN'
  },
  {
    code: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    flag: '🇮🇳',
    speechLang: 'ml-IN',
    voiceLang: 'ml-IN'
  },
  {
    code: 'pa-IN',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    flag: '🇮🇳',
    speechLang: 'pa-IN',
    voiceLang: 'pa-IN'
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechLang: 'es-ES',
    voiceLang: 'es-ES'
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    speechLang: 'fr-FR',
    voiceLang: 'fr-FR'
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    speechLang: 'de-DE',
    voiceLang: 'de-DE'
  },
  {
    code: 'ja-JP',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    speechLang: 'ja-JP',
    voiceLang: 'ja-JP'
  },
  {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '中文',
    flag: '🇨🇳',
    speechLang: 'zh-CN',
    voiceLang: 'zh-CN'
  }
];

// Voice Commands with multilingual support
export const VOICE_COMMANDS: VoiceCommand[] = [
  {
    command: 'pause|pausa|रोकें|நிறுத்து|పాజ్|বিরতি',
    action: 'pause',
    description: 'Pause the current session'
  },
  {
    command: 'resume|continue|reanudar|continuar|जारी रखें|தொடர்|కొనసాగించు|চালিয়ে যান',
    action: 'resume',
    description: 'Resume the session'
  },
  {
    command: 'stop|detener|बंद करें|நிறுத்து|ఆపు|বন্ধ করুন',
    action: 'stop',
    description: 'Stop the session'
  },
  {
    command: 'next|siguiente|अगला|அடுத்து|తదుపరి|পরবর্তী',
    action: 'next',
    description: 'Go to next step'
  },
  {
    command: 'help|ayuda|मदद|உதவி|సహాయం|সাহায্য',
    action: 'help',
    description: 'Get help or explanation'
  },
  {
    command: 'explain|explicar|समझाएं|விளக்கு|వివరించు|ব্যাখ্যা করুন',
    action: 'explain',
    description: 'Explain current technique'
  },
  {
    command: 'slower|más lento|धीमा|மெதுவாக|నెమ్మదిగా|ধীরে',
    action: 'slower',
    description: 'Make the pace slower'
  },
  {
    command: 'faster|más rápido|तेज़|வேகமாக|వేగంగా|দ্রুত',
    action: 'faster',
    description: 'Make the pace faster'
  }
];

// Function to find the best voice for a language and profile
export const findBestVoice = (
  availableVoices: SpeechSynthesisVoice[],
  language: LanguageOption,
  profile: VoiceProfile
): SpeechSynthesisVoice | null => {
  if (!availableVoices.length) return null;

  // First, try to find a voice that matches the exact language
  let matchingVoices = availableVoices.filter(voice => 
    voice.lang.toLowerCase().startsWith(language.voiceLang.toLowerCase())
  );

  if (matchingVoices.length === 0) {
    // Fallback to language family (e.g., 'en' for 'en-US')
    const langFamily = language.voiceLang.split('-')[0];
    matchingVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().startsWith(langFamily)
    );
  }

  if (matchingVoices.length === 0) {
    // Final fallback to any English voice
    matchingVoices = availableVoices.filter(voice => 
      voice.lang.toLowerCase().startsWith('en')
    );
  }

  if (matchingVoices.length === 0) {
    return availableVoices[0]; // Last resort
  }

  // Prefer female voices for meditation
  const femaleVoices = matchingVoices.filter(voice => 
    voice.name.toLowerCase().includes('female') ||
    voice.name.toLowerCase().includes('woman') ||
    voice.name.toLowerCase().includes('samantha') ||
    voice.name.toLowerCase().includes('karen') ||
    voice.name.toLowerCase().includes('moira') ||
    voice.name.toLowerCase().includes('tessa') ||
    voice.name.toLowerCase().includes('veena') ||
    voice.name.toLowerCase().includes('raveena')
  );

  return femaleVoices.length > 0 ? femaleVoices[0] : matchingVoices[0];
};

// Default voice profile
export const DEFAULT_VOICE_PROFILE = VOICE_PROFILES[0]; // Shanti (Gentle)
export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0]; // English (US)
