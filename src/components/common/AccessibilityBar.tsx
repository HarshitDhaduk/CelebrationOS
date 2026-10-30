/**
 * @file AccessibilityBar.tsx
 * @description Accessible toolbar providing WCAG AAA display controls, high-contrast toggle,
 * font scaling, reduced motion toggles, and keyboard shortcut assistance.
 */

import React from 'react';
import { Eye, Type, Activity, Keyboard, X } from 'lucide-react';
import { AccessibilityState } from '../../hooks/useAccessibilityState';
import { Button } from './Button';

interface AccessibilityBarProps {
  accessibility: AccessibilityState;
}

export const AccessibilityBar: React.FC<AccessibilityBarProps> = ({ accessibility }) => {
  const {
    isHighContrast,
    fontScale,
    isReduceMotion,
    isShortcutsOpen,
    announcement,
    toggleHighContrast,
    setFontScale,
    toggleReduceMotion,
    setIsShortcutsOpen,
  } = accessibility;

  return (
    <>
      {/* Hidden ARIA Live region for screen-reader announcements */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        id="a11y-announcer"
      >
        {announcement}
      </div>

      {/* Accessibility & Display Controls Bar */}
      <nav
        aria-label="Accessibility & Display Controls"
        className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 text-slate-700 dark:text-slate-300"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold flex items-center gap-1.5 text-slate-900 dark:text-slate-100">
            <Eye className="w-3.5 h-3.5 text-rose-500" aria-hidden="true" />
            <span>Accessibility:</span>
          </span>
          <span className="hidden sm:inline text-slate-500 dark:text-slate-400">
            WCAG 2.1 AA Compliant
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* High Contrast Mode Toggle */}
          <button
            type="button"
            onClick={toggleHighContrast}
            aria-pressed={isHighContrast}
            aria-label={`Toggle high contrast mode. Currently ${isHighContrast ? 'enabled' : 'disabled'}`}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isHighContrast
                ? 'bg-amber-400 text-black border-amber-500 font-bold'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" aria-hidden="true" />
            <span>High Contrast</span>
          </button>

          {/* Font Scale Selector */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded p-0.5" role="group" aria-label="Font Size">
            <Type className="w-3 h-3 ml-1.5 text-slate-400" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setFontScale('normal')}
              aria-pressed={fontScale === 'normal'}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                fontScale === 'normal'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => setFontScale('large')}
              aria-pressed={fontScale === 'large'}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                fontScale === 'large'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              120%
            </button>
            <button
              type="button"
              onClick={() => setFontScale('xl')}
              aria-pressed={fontScale === 'xl'}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                fontScale === 'xl'
                  ? 'bg-rose-500 text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              140%
            </button>
          </div>

          {/* Reduced Motion Toggle */}
          <button
            type="button"
            onClick={toggleReduceMotion}
            aria-pressed={isReduceMotion}
            aria-label={`Toggle reduced motion. Currently ${isReduceMotion ? 'enabled' : 'disabled'}`}
            className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors border ${
              isReduceMotion
                ? 'bg-blue-600 text-white border-blue-700'
                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
            }`}
          >
            <Activity className="w-3 h-3" aria-hidden="true" />
            <span>Reduce Motion</span>
          </button>

          {/* Keyboard Shortcuts Dialog Trigger */}
          <button
            type="button"
            onClick={() => setIsShortcutsOpen(true)}
            aria-label="View keyboard shortcuts guide (Alt+A)"
            className="px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Keyboard className="w-3 h-3 text-rose-500" aria-hidden="true" />
            <span>Shortcuts</span>
            <kbd className="hidden md:inline font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1 py-0.2 rounded text-slate-600 dark:text-slate-300">
              Alt+A
            </kbd>
          </button>
        </div>
      </nav>

      {/* Accessible Keyboard Shortcuts Reference Modal */}
      {isShortcutsOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-rose-500" aria-hidden="true" />
                <h3 id="shortcuts-title" className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Keyboard Navigation Shortcuts
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(false)}
                aria-label="Close shortcuts dialog"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              CelebrationOS is designed for complete hands-free navigation. Planners and assistive technology users can navigate using global access keys:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Budget Manager</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Alt + B</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Timeline Schedule</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Alt + T</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Vendor Hub</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Alt + V</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Creative Studio</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Alt + I</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Celebration Copilot</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Alt + C</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">High Contrast</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Alt + H</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Shortcuts Guide</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Alt + A</kbd>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <span className="font-medium text-slate-700 dark:text-slate-300">Close Dialogs</span>
                <kbd className="font-mono bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-600 font-bold">Escape</kbd>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="primary"
                onClick={() => setIsShortcutsOpen(false)}
                className="w-full sm:w-auto text-xs py-2"
              >
                Got It
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
