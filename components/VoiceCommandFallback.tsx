import React from 'react';
import { useVoice } from '../VoiceContext';

interface VoiceCommandFallbackProps {
  onCommand: (command: string) => void;
  availableCommands?: string[];
  isVisible?: boolean;
  context?: 'practice' | 'general' | 'navigation';
}

const VoiceCommandFallback: React.FC<VoiceCommandFallbackProps> = ({
  onCommand,
  availableCommands,
  isVisible = true,
  context = 'general'
}) => {
  const { isSupported, permissionStatus, isListening, currentLanguage } = useVoice();

  // Don't show if voice is working properly
  if (isSupported && permissionStatus === 'granted' && !isVisible) {
    return null;
  }

  // Define command buttons based on context and language
  const getCommandButtons = () => {
    const isHindi = currentLanguage.code.startsWith('hi');
    const isTamil = currentLanguage.code.startsWith('ta');
    const isTelugu = currentLanguage.code.startsWith('te');
    const isBengali = currentLanguage.code.startsWith('bn');
    const isSpanish = currentLanguage.code.startsWith('es');

    const baseCommands = [
      {
        command: 'pause',
        label: isHindi ? 'रोकें' : isTamil ? 'நிறுத்து' : isTelugu ? 'పాజ్' : isBengali ? 'বিরতি' : isSpanish ? 'Pausar' : 'Pause',
        icon: '⏸️',
        color: 'bg-yellow-500 hover:bg-yellow-600'
      },
      {
        command: 'resume',
        label: isHindi ? 'जारी रखें' : isTamil ? 'தொடர்' : isTelugu ? 'కొనసాగించు' : isBengali ? 'চালিয়ে যান' : isSpanish ? 'Continuar' : 'Resume',
        icon: '▶️',
        color: 'bg-green-500 hover:bg-green-600'
      },
      {
        command: 'stop',
        label: isHindi ? 'बंद करें' : isTamil ? 'நிறுத்து' : isTelugu ? 'ఆపు' : isBengali ? 'বন্ধ করুন' : isSpanish ? 'Parar' : 'Stop',
        icon: '⏹️',
        color: 'bg-red-500 hover:bg-red-600'
      }
    ];

    const practiceCommands = [
      {
        command: 'next',
        label: isHindi ? 'अगला' : isTamil ? 'அடுத்து' : isTelugu ? 'తదుపరి' : isBengali ? 'পরবর্তী' : isSpanish ? 'Siguiente' : 'Next',
        icon: '⏭️',
        color: 'bg-blue-500 hover:bg-blue-600'
      },
      {
        command: 'explain',
        label: isHindi ? 'समझाएं' : isTamil ? 'விளக்கு' : isTelugu ? 'వివరించు' : isBengali ? 'ব্যাখ্যা করুন' : isSpanish ? 'Explicar' : 'Explain',
        icon: '💡',
        color: 'bg-purple-500 hover:bg-purple-600'
      },
      {
        command: 'help',
        label: isHindi ? 'मदद' : isTamil ? 'உதவி' : isTelugu ? 'సహాయం' : isBengali ? 'সাহায্য' : isSpanish ? 'Ayuda' : 'Help',
        icon: '❓',
        color: 'bg-orange-500 hover:bg-orange-600'
      }
    ];

    const speedCommands = [
      {
        command: 'slower',
        label: isHindi ? 'धीमा' : isTamil ? 'மெதுவாக' : isTelugu ? 'నెమ్మదిగా' : isBengali ? 'ধীরে' : isSpanish ? 'Más lento' : 'Slower',
        icon: '🐌',
        color: 'bg-indigo-500 hover:bg-indigo-600'
      },
      {
        command: 'faster',
        label: isHindi ? 'तेज़' : isTamil ? 'வேகமாக' : isTelugu ? 'వేగంగా' : isBengali ? 'দ্রুত' : isSpanish ? 'Más rápido' : 'Faster',
        icon: '🐰',
        color: 'bg-pink-500 hover:bg-pink-600'
      }
    ];

    switch (context) {
      case 'practice':
        return [...baseCommands, ...practiceCommands, ...speedCommands];
      case 'navigation':
        return baseCommands.slice(0, 2); // Just pause/resume for navigation
      default:
        return baseCommands;
    }
  };

  const commandButtons = getCommandButtons();
  const filteredCommands = availableCommands 
    ? commandButtons.filter(btn => availableCommands.includes(btn.command))
    : commandButtons;

  const handleCommandClick = (command: string) => {
    onCommand(command);
  };

  const getStatusMessage = () => {
    if (!isSupported) {
      return currentLanguage.code.startsWith('hi') 
        ? 'आवाज़ समर्थित नहीं है - बटन का उपयोग करें'
        : currentLanguage.code.startsWith('ta')
        ? 'குரல் ஆதரவு இல்லை - பொத்தான்களைப் பயன்படுத்தவும்'
        : currentLanguage.code.startsWith('es')
        ? 'Voz no compatible - usar botones'
        : 'Voice not supported - use buttons';
    }
    if (permissionStatus === 'denied') {
      return currentLanguage.code.startsWith('hi')
        ? 'माइक्रोफ़ोन अनुमति नहीं - बटन का उपयोग करें'
        : currentLanguage.code.startsWith('ta')
        ? 'மைக்ரோஃபோன் அனுமதி இல்லை - பொத்தான்களைப் பயன்படுத்தவும்'
        : currentLanguage.code.startsWith('es')
        ? 'Micrófono denegado - usar botones'
        : 'Microphone denied - use buttons';
    }
    if (isListening) {
      return currentLanguage.code.startsWith('hi')
        ? 'सुन रहा है... या बटन दबाएं'
        : currentLanguage.code.startsWith('ta')
        ? 'கேட்கிறது... அல்லது பொத்தானை அழுத்தவும்'
        : currentLanguage.code.startsWith('es')
        ? 'Escuchando... o presiona botón'
        : 'Listening... or press button';
    }
    return currentLanguage.code.startsWith('hi')
      ? 'आसान नियंत्रण के लिए बटन दबाएं'
      : currentLanguage.code.startsWith('ta')
      ? 'எளிய கட்டுப்பாட்டிற்கு பொத்தானை அழுத்தவும்'
      : currentLanguage.code.startsWith('es')
      ? 'Presiona botones para control fácil'
      : 'Press buttons for easy control';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
      {/* Status Message */}
      <div className="text-center mb-3">
        <p className="text-sm text-gray-600 font-medium">
          {getStatusMessage()}
        </p>
      </div>

      {/* Command Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {filteredCommands.map((cmd) => (
          <button
            key={cmd.command}
            onClick={() => handleCommandClick(cmd.command)}
            className={`${cmd.color} text-white px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[44px]`}
            aria-label={`${cmd.label} command`}
          >
            <span className="text-lg">{cmd.icon}</span>
            <span className="truncate">{cmd.label}</span>
          </button>
        ))}
      </div>

      {/* Voice Status Indicator */}
      {isSupported && permissionStatus === 'granted' && (
        <div className="mt-3 flex items-center justify-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-xs text-gray-500">
            {isListening 
              ? (currentLanguage.code.startsWith('hi') ? 'आवाज़ सक्रिय' : 'Voice Active')
              : (currentLanguage.code.startsWith('hi') ? 'आवाज़ निष्क्रिय' : 'Voice Inactive')
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceCommandFallback;
