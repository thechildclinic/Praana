
import React, { useState } from 'react';
import { SHANTI_MESSAGES } from '../constants';

interface ActivationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onActivate: (code: string) => void;
}

const ActivationModal: React.FC<ActivationModalProps> = ({ isOpen, onClose, onActivate }) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onActivate(code.trim());
    }
  };

  // Extract the URL part from the SHANTI_MESSAGES.activationVisitWebsite string
  const urlMatch = SHANTI_MESSAGES.activationVisitWebsite.match(/\[(.*?)\]/);
  const purchaseUrl = urlMatch ? urlMatch[1] : "https://greybrain.ai/activate"; // Fallback URL to greybrain.ai
  const purchaseLinkText = SHANTI_MESSAGES.activationVisitWebsite.replace(/\[.*?\]/, "here");


  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-teal-700" style={{fontFamily: "'Lora', serif"}}>{SHANTI_MESSAGES.activationModalTitle}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-3xl font-light leading-none p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-slate-300"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="activation-code" className="block text-sm font-medium text-slate-700 mb-1">
            {SHANTI_MESSAGES.activationCodeLabel}
          </label>
          <input
            type="text"
            id="activation-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 shadow-sm"
            placeholder="Enter your GreyBrain.ai code"
            required
          />
          <div className="mt-2 text-xs text-slate-500">
            {SHANTI_MESSAGES.activationPurchasePrompt}
            <a 
              href={purchaseUrl.startsWith('http') ? purchaseUrl : `https://${purchaseUrl}`} 
              target="_blank" rel="noopener noreferrer" 
              className="text-teal-600 hover:text-teal-700 underline"
            >
                {purchaseLinkText.includes("here") ? "purchase your code here" : purchaseLinkText}
            </a>.
          </div>
          <div className="mt-6 flex justify-end space-x-3">
             <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium bg-slate-200 text-slate-700 rounded-lg shadow-sm hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-teal-600 text-white rounded-lg shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              {SHANTI_MESSAGES.activationSubmitButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivationModal;
