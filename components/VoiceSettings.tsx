import React, { useState } from 'react';
import { useVoice } from '../VoiceContext';
import { VoiceProfile, LanguageOption } from '../types';

interface VoiceSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ isOpen, onClose }) => {
  const {
    currentVoiceProfile,
    currentLanguage,
    voiceProfiles,
    supportedLanguages,
    setVoiceProfile,
    setLanguage,
    speak,
    isSpeaking
  } = useVoice();

  const [selectedProfile, setSelectedProfile] = useState<VoiceProfile>(currentVoiceProfile);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(currentLanguage);

  if (!isOpen) return null;

  const handleProfileChange = (profile: VoiceProfile) => {
    setSelectedProfile(profile);
  };

  const handleLanguageChange = (language: LanguageOption) => {
    setSelectedLanguage(language);
  };

  const handleTestVoice = () => {
    if (!isSpeaking) {
      const testMessage = selectedLanguage.code.startsWith('hi') 
        ? "नमस्ते, मैं शांति हूं। यह आपकी आवाज़ का परीक्षण है।"
        : selectedLanguage.code.startsWith('ta')
        ? "வணக்கம், நான் சாந்தி. இது உங்கள் குரல் சோதனை."
        : selectedLanguage.code.startsWith('te')
        ? "నమస్కారం, నేను శాంతి. ఇది మీ వాయిస్ టెస్ట్."
        : selectedLanguage.code.startsWith('bn')
        ? "নমস্কার, আমি শান্তি। এটি আপনার ভয়েস টেস্ট।"
        : selectedLanguage.code.startsWith('es')
        ? "Hola, soy Shanti. Esta es tu prueba de voz."
        : selectedLanguage.code.startsWith('fr')
        ? "Bonjour, je suis Shanti. Ceci est votre test vocal."
        : "Hello, I'm Shanti. This is your voice test.";
      
      speak(testMessage);
    }
  };

  const handleSave = () => {
    setVoiceProfile(selectedProfile);
    setLanguage(selectedLanguage);
    onClose();
  };

  const handleCancel = () => {
    setSelectedProfile(currentVoiceProfile);
    setSelectedLanguage(currentLanguage);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Voice Settings</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Language
          </label>
          <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className={`p-3 text-left rounded-lg border transition-colors ${
                  selectedLanguage.code === language.code
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-sm text-gray-500">{language.nativeName}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Profile Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Voice Personality
          </label>
          <div className="space-y-2">
            {voiceProfiles.map((profile) => (
              <button
                key={profile.id}
                onClick={() => handleProfileChange(profile)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  selectedProfile.id === profile.id
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{profile.name}</div>
                <div className="text-sm text-gray-500">{profile.description}</div>
                <div className="text-xs text-gray-400 mt-1">
                  Rate: {profile.rate}x • Pitch: {profile.pitch}x
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Test Voice Button */}
        <div className="mb-6">
          <button
            onClick={handleTestVoice}
            disabled={isSpeaking}
            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
              isSpeaking
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSpeaking ? 'Testing Voice...' : 'Test Voice'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Save Settings
          </button>
        </div>

        {/* Voice Info */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600">
            <div><strong>Current:</strong> {selectedProfile.name}</div>
            <div><strong>Language:</strong> {selectedLanguage.name}</div>
            <div><strong>Available Voices:</strong> Browser dependent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettings;
