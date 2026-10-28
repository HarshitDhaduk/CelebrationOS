import React from 'react';
import { EventType, Currency } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Sparkles, Key, Download, Moon, Sun, Heart, Cake, Users, ChevronDown } from 'lucide-react';

interface NavbarProps {
  currentEventType: EventType;
  onSelectEventType: (type: EventType) => void;
  currency: Currency;
  onChangeCurrency: (curr: Currency) => void;
  apiKey: string;
  onOpenApiKeyModal: () => void;
  onOpenExportModal: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentEventType,
  onSelectEventType,
  currency,
  onChangeCurrency,
  apiKey,
  onOpenApiKeyModal,
  onOpenExportModal,
  isDarkMode,
  onToggleDarkMode,
  onOpenAssistant,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Sparkles className="w-5 h-5 animate-pulse-subtle" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-rose-600 dark:from-white dark:via-slate-100 dark:to-rose-400 bg-clip-text text-transparent">
                Celebration<span className="text-rose-500">OS</span>
              </span>
              <Badge variant="rose" size="sm">
                PromptWars #5
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              GenAI Event Planning Operating System
            </p>
          </div>
        </div>

        {/* Middle: Event Preset Switcher */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs font-semibold">
          <button
            onClick={() => onSelectEventType('wedding')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentEventType === 'wedding'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>Wedding</span>
          </button>

          <button
            onClick={() => onSelectEventType('birthday')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentEventType === 'birthday'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cake className="w-3.5 h-3.5 text-amber-500" />
            <span>Birthday</span>
          </button>

          <button
            onClick={() => onSelectEventType('community')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              currentEventType === 'community'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-emerald-500" />
            <span>Community</span>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Currency Dropdown */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value as Currency)}
              aria-label="Select Currency"
              className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 appearance-none pr-6 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2.5 pointer-events-none" />
          </div>

          {/* AI Connection Status Pill */}
          <button
            onClick={onOpenApiKeyModal}
            title={apiKey ? 'Google Gemini API Connected' : 'Running on Built-in Copilot Engine (Click to add Gemini Key)'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              apiKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
            }`}
          >
            <Key className="w-3 h-3" />
            <span>{apiKey ? 'Gemini 2.5 Live' : 'AI Copilot Ready'}</span>
          </button>

          {/* Export Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenExportModal}
            className="hidden sm:inline-flex"
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Export
          </Button>

          {/* AI Assistant Drawer Trigger */}
          <Button
            size="sm"
            variant="primary"
            onClick={onOpenAssistant}
            icon={<Sparkles className="w-3.5 h-3.5" />}
          >
            <span className="hidden sm:inline">Ask</span> Copilot
          </Button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            aria-label="Toggle dark mode"
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Preset Switcher Row */}
      <div className="flex md:hidden px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60 gap-1.5 overflow-x-auto text-xs">
        <button
          onClick={() => onSelectEventType('wedding')}
          className={`flex-1 py-1 px-2 rounded-lg font-medium text-center ${
            currentEventType === 'wedding' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          💒 Wedding
        </button>
        <button
          onClick={() => onSelectEventType('birthday')}
          className={`flex-1 py-1 px-2 rounded-lg font-medium text-center ${
            currentEventType === 'birthday' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          🎂 Birthday
        </button>
        <button
          onClick={() => onSelectEventType('community')}
          className={`flex-1 py-1 px-2 rounded-lg font-medium text-center ${
            currentEventType === 'community' ? 'bg-emerald-600 text-white' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          🌳 Community
        </button>
      </div>
    </header>
  );
};
