import React from 'react';
import { ModalContent } from '../types';

interface ModalDialogProps {
  isOpen: boolean;
  onClose?: () => void; 
  content: ModalContent | null;
}

const ModalDialog: React.FC<ModalDialogProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen || !content) return null;

  const renderMessage = () => {
    if (typeof content.message === 'string' || React.isValidElement(content.message)) {
      return content.message;
    }
    return <p>{String(content.message)}</p>; 
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-[var(--theme-bg-modal)] rounded-lg shadow-xl p-6 w-full max-w-md transform transition-all duration-300 ease-in-out scale-100">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[var(--theme-highlight-accent)]" style={{fontFamily: "'Lora', serif"}}>{content.title}</h2>
          {onClose && (
             <button
              onClick={onClose}
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-body)] text-3xl font-light leading-none p-1 -m-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--theme-highlight-focus)]"
              aria-label="Close modal"
            >
              &times;
            </button>
          )}
        </div>
        <div className="text-[var(--theme-text-body)] mb-6 prose max-w-none text-sm leading-relaxed">
          {renderMessage()}
        </div>
        {content.actions && content.actions.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            {content.actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out
                  ${action.style === 'primary' || !action.style 
                    ? 'bg-[var(--theme-action-primary-bg)] text-[var(--theme-action-primary-text)] hover:bg-[var(--theme-action-primary-bg-hover)] focus:ring-[var(--theme-highlight-focus)]' 
                    : 'bg-[var(--theme-action-secondary-bg)] text-[var(--theme-action-secondary-text)] hover:bg-[var(--theme-action-secondary-bg-hover)] focus:ring-[var(--theme-border-interactive)]'}`}
              >
                {action.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalDialog;