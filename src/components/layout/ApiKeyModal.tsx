import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Key, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { saveGeminiApiKey } from '../../services/storage';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  currentKey,
  onSaveKey,
}) => {
  const [keyInput, setKeyInput] = useState(currentKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    saveGeminiApiKey(keyInput);
    onSaveKey(keyInput);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setKeyInput('');
    saveGeminiApiKey('');
    onSaveKey('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Google Gemini AI Configuration"
      description="Connect your Google AI Studio API key for real-time generative intelligence."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 dark:border-rose-800 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong>Built-in Offline Engine Included:</strong> If you do not have an API key right now, CelebrationOS runs on our high-fidelity, contextual simulation engine out of the box with zero setup required!
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
            Gemini API Key
          </label>
          <div className="relative">
            <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="password"
              placeholder="AIzaSy..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Your key is saved only in your local browser storage and sent directly to Google Gemini.
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          {keyInput && (
            <button
              onClick={handleClear}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Clear Key
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              icon={savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : undefined}
            >
              {savedSuccess ? 'Saved!' : 'Save & Activate'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
