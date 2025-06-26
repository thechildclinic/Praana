import React from 'react';
import { PranayamaTechnique, TechniquePhase } from '../types'; 

interface BreathingAnimatorProps {
  technique: PranayamaTechnique;
  currentPhase: TechniquePhase | null;
  phaseProgress: number; // 0 to 1 for timed phases
  isInstructionalView?: boolean; // New prop
}

const InstructionalDiagram: React.FC<{type: PranayamaTechnique['instructionalDiagramType']}> = ({ type }) => {
  let content;
  // Note: These diagrams still use some Tailwind direct color classes for simplicity.
  // For full theming, these would also need to use CSS variables or be SVG components taking theme colors.
  switch(type) {
    case 'belly':
      content = (
        <div className="text-center">
          <p className="font-semibold text-[var(--theme-animator-instructional-accent)] mb-2">Diaphragmatic (Belly) Breathing</p>
          <div className="flex items-center justify-center space-x-2 text-[var(--theme-animator-instructional-text)]">
            <span>👃</span>
            <span>IN</span> <span className="text-2xl text-sky-500">&rarr;</span> 
            <span className="inline-block p-2 border-2 border-sky-400 rounded-full bg-sky-100">Belly Expands</span>
          </div>
          <div className="text-2xl my-1 text-slate-400">&darr; &uarr;</div>
          <div className="flex items-center justify-center space-x-2 text-[var(--theme-animator-instructional-text)]">
             <span>👄/👃</span>
             <span>OUT</span> <span className="text-2xl text-purple-500">&rarr;</span> 
            <span className="inline-block p-2 border-2 border-purple-400 rounded-full bg-purple-100">Belly Contracts</span>
          </div>
        </div>
      );
      break;
    case 'throat-sound':
      content = (
        <div className="text-center">
          <p className="font-semibold text-[var(--theme-animator-instructional-accent)] mb-2">Ujjayi (Ocean) Breath</p>
          <p className="text-[var(--theme-animator-instructional-text)]">Gentle throat constriction (like whispering).</p>
          <p className="text-[var(--theme-animator-instructional-text)] my-1">👃 IN &harr; OUT 👃</p>
          <p className="text-indigo-500 text-2xl">~~~ <span className="text-sm align-middle">Ocean Sound</span> ~~~</p>
        </div>
      );
      break;
    case 'forceful-exhale':
      content = (
        <div className="text-center">
          <p className="font-semibold text-[var(--theme-animator-instructional-accent)] mb-2">Kapalabhati (Skull Shining)</p>
          <p className="text-[var(--theme-animator-instructional-text)]">👃 <span className="font-bold text-red-500">Forceful EXHALE</span> (Passive Inhale)</p>
          <p className="text-red-500 text-3xl">&darr;&darr;&darr;</p>
          <p className="text-sm text-slate-500">(Repeat rapidly)</p>
        </div>
      );
      break;
    case 'alternate-nostril':
      content = (
        <div className="text-center">
          <p className="font-semibold text-[var(--theme-animator-instructional-accent)] mb-2">Anulom Vilom (Alternate Nostril)</p>
          <div className="space-y-1 text-[var(--theme-animator-instructional-text)]">
            <p><span className="font-bold text-sky-600">L</span> Nostril <span className="text-sky-500">IN</span> &rarr; Hold &rarr; <span className="font-bold text-purple-600">R</span> Nostril <span className="text-purple-500">OUT</span></p>
            <p><span className="font-bold text-purple-600">R</span> Nostril <span className="text-purple-500">IN</span> &rarr; Hold &rarr; <span className="font-bold text-sky-600">L</span> Nostril <span className="text-sky-500">OUT</span></p>
          </div>
           <p className="text-xs text-slate-500 mt-2">(Use fingers to close nostrils)</p>
        </div>
      );
      break;
    case 'humming-vibration':
      content = (
        <div className="text-center">
          <p className="font-semibold text-[var(--theme-animator-instructional-accent)] mb-2">Bhramari (Bee Breath)</p>
          <p className="text-[var(--theme-animator-instructional-text)]">👃 IN &rarr; 👄 <span className="font-bold text-fuchsia-500">HUMMM</span> on EXHALE</p>
          <p className="text-fuchsia-500 text-2xl"> vibrating ~~~</p>
          <p className="text-sm text-slate-500">(Ears gently closed optional)</p>
        </div>
      );
      break;
    default:
      content = <p className="text-slate-500">Instructions on screen.</p>;
  }
  return <div className="h-48 w-full max-w-xs bg-[var(--theme-animator-instructional-bg)] rounded-lg flex items-center justify-center p-3 shadow-inner border border-[var(--theme-animator-instructional-border)]">{content}</div>;
};


const BreathingAnimator: React.FC<BreathingAnimatorProps> = ({ technique, currentPhase, phaseProgress, isInstructionalView }) => {
  if (isInstructionalView) {
    return <InstructionalDiagram type={technique.instructionalDiagramType} />;
  }

  if (!currentPhase) return <div className="h-48 w-48 bg-[var(--theme-border-decorative)] rounded-full flex items-center justify-center text-[var(--theme-text-muted)]">Waiting...</div>;

  const animationType = technique.animationType;

  let animationStyle: React.CSSProperties = {};
  let content: React.ReactNode = currentPhase.text || '';
  if (!content && currentPhase.details) { 
    content = currentPhase.details;
  }
  
  const maxSizeFactor = 1.5;

  switch (animationType) {
    case 'expand-contract':
      if (currentPhase.type === 'inhale') {
        animationStyle.transform = `scale(${1 + (maxSizeFactor - 1) * phaseProgress})`;
      } else if (currentPhase.type === 'exhale') {
        animationStyle.transform = `scale(${maxSizeFactor - (maxSizeFactor - 1) * phaseProgress})`;
      } else if (currentPhase.type === 'hold_in') {
         animationStyle.transform = `scale(${maxSizeFactor})`;
      } else {
        animationStyle.transform = 'scale(1)';
      }
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <div 
            className="w-36 h-36 bg-[var(--theme-animator-expand-contract-bg)] rounded-full flex items-center justify-center text-[var(--theme-animator-expand-contract-text)] text-center transition-transform duration-500 ease-in-out shadow-lg"
            style={animationStyle}
          >
            <span className="text-sm p-2">{content}</span>
          </div>
        </div>
      );

    case 'glow':
      let opacity = 0.5;
      if (currentPhase.type === 'inhale') opacity = 0.5 + 0.5 * phaseProgress;
      if (currentPhase.type === 'exhale') opacity = 1.0 - 0.5 * phaseProgress;
      if (currentPhase.type === 'hold_in') opacity = 1.0;
      // Using a direct color for the shadow from theme if defined, or constructing it
      const glowShadowColor = technique.id === 'ujjayi' ? 'var(--theme-animator-glow-shadow)' : 'rgba(74, 222, 128, 0.7)'; // Default fallback green
      animationStyle.boxShadow = `0 0 30px 10px ${glowShadowColor.replace(')', `, ${opacity})`).replace('rgba(', 'rgba(')}`;
      
      return (
         <div className="flex flex-col items-center justify-center p-4">
            <div 
            className="w-36 h-36 bg-[var(--theme-animator-glow-bg)] rounded-full flex items-center justify-center text-[var(--theme-text-on-primary-action)] text-center transition-all duration-500 ease-in-out shadow-lg" // Assuming glow bg is dark enough for white text
            style={animationStyle}
            >
             <span className="text-sm p-2">{content}</span>
            </div>
        </div>
      );
      
    case 'pulse': 
      const pulseContent = currentPhase.type === 'custom' ? (currentPhase.details || currentPhase.text || '') : content;
      return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-36 h-36 border-4 border-[var(--theme-animator-pulse-border)] rounded-full flex items-center justify-center text-[var(--theme-animator-pulse-text)] text-center shadow-md">
                <span className="text-sm p-2">{pulseContent}</span>
            </div>
        </div>
      );

    case 'nostril-alternating':
      const isActiveLeft = currentPhase.type.includes('left');
      const isActiveRight = currentPhase.type.includes('right');
      return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="text-center mb-2 text-sm text-[var(--theme-text-muted)]">{content}</div>
            <div className="flex space-x-4">
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isActiveLeft ? 'bg-[var(--theme-animator-nostril-active-bg)] border-[var(--theme-highlight-accent)] text-[var(--theme-text-on-primary-action)] shadow-lg scale-110' : 'bg-[var(--theme-animator-nostril-inactive-bg)] border-[var(--theme-border-interactive)] text-[var(--theme-text-muted)]'}`}>
                L
            </div>
            <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isActiveRight ? 'bg-[var(--theme-animator-nostril-active-bg)] border-[var(--theme-highlight-accent)] text-[var(--theme-text-on-primary-action)] shadow-lg scale-110' : 'bg-[var(--theme-animator-nostril-inactive-bg)] border-[var(--theme-border-interactive)] text-[var(--theme-text-muted)]'}`}>
                R
            </div>
            </div>
        </div>
      );

    case 'ripple': 
      return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="relative w-36 h-36 rounded-full bg-[var(--theme-animator-ripple-bg)] flex items-center justify-center text-[var(--theme-text-on-primary-action)] text-center shadow-lg">
            <span className="text-sm p-2">{content}</span>
            {currentPhase.type === 'hum' && (
                <>
                <div className="absolute inset-0 rounded-full border-2 border-[var(--theme-animator-ripple-border)] animate-ping opacity-75" style={{animationDuration: '1.5s'}}></div>
                <div className="absolute inset-0 rounded-full border-2 border-[var(--theme-animator-ripple-border)] animate-ping opacity-50" style={{animationDuration: '2s', animationDelay: '0.5s', filter: 'brightness(1.2)'}}></div>
                </>
            )}
            </div>
        </div>
      );

    default:
      return <div className="h-48 w-48 bg-[var(--theme-border-decorative)] rounded-full flex items-center justify-center text-[var(--theme-text-muted)] p-2 text-center">{content}</div>;
  }
};

export default BreathingAnimator;