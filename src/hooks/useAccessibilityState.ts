/**
 * @file useAccessibilityState.ts
 * @description Custom hook for enterprise accessibility (a11y) management.
 * Provides WCAG 2.1 AA / AAA compliance features:
 * - Global keyboard navigation hotkeys (Alt+A, Alt+B, Alt+T, Alt+V, Alt+I, Alt+C, Alt+H, Escape)
 * - High-contrast theme toggle with persistence
 * - Font scaling (Normal, Large, Extra Large)
 * - Reduced motion preferences
 * - Screen-reader live region announcer via aria-live="polite"
 */

import { useState, useEffect, useCallback } from 'react';

export type FontScale = 'normal' | 'large' | 'xl';

export interface AccessibilityState {
  isHighContrast: boolean;
  fontScale: FontScale;
  isReduceMotion: boolean;
  isShortcutsOpen: boolean;
  announcement: string;
  toggleHighContrast: () => void;
  setFontScale: (scale: FontScale) => void;
  toggleReduceMotion: () => void;
  setIsShortcutsOpen: (open: boolean) => void;
  announce: (message: string) => void;
}

export interface NavigationCallbacks {
  onSelectTab?: (tab: 'budget' | 'timeline' | 'vendors' | 'ideas') => void;
  onToggleCopilot?: () => void;
  onCloseModals?: () => void;
}

const HIGH_CONTRAST_KEY = 'celebration_a11y_high_contrast';
const FONT_SCALE_KEY = 'celebration_a11y_font_scale';
const REDUCE_MOTION_KEY = 'celebration_a11y_reduce_motion';

export function useAccessibilityState(callbacks?: NavigationCallbacks): AccessibilityState {
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HIGH_CONTRAST_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [fontScale, setFontScaleState] = useState<FontScale>(() => {
    try {
      const stored = localStorage.getItem(FONT_SCALE_KEY);
      return (stored === 'large' || stored === 'xl') ? stored : 'normal';
    } catch {
      return 'normal';
    }
  });

  const [isReduceMotion, setIsReduceMotion] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      }
      return localStorage.getItem(REDUCE_MOTION_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');

  const announce = useCallback((message: string) => {
    setAnnouncement('');
    // Defer slight tick so screen readers detect attribute change
    setTimeout(() => {
      setAnnouncement(message);
    }, 50);
  }, []);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrast((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(HIGH_CONTRAST_KEY, String(next));
      } catch {
        // Ignore quota issues
      }
      announce(next ? 'High Contrast Mode Enabled' : 'High Contrast Mode Disabled');
      return next;
    });
  }, [announce]);

  const setFontScale = useCallback((scale: FontScale) => {
    setFontScaleState(scale);
    try {
      localStorage.setItem(FONT_SCALE_KEY, scale);
    } catch {
      // Ignore
    }
    announce(`Font scale set to ${scale}`);
  }, [announce]);

  const toggleReduceMotion = useCallback(() => {
    setIsReduceMotion((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(REDUCE_MOTION_KEY, String(next));
      } catch {
        // Ignore
      }
      announce(next ? 'Reduced Motion Enabled' : 'Standard Animations Enabled');
      return next;
    });
  }, [announce]);

  // Synchronize CSS classes to root HTML element
  useEffect(() => {
    const root = document.documentElement;

    // High Contrast class
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font Scale classes
    root.classList.remove('font-scale-normal', 'font-scale-large', 'font-scale-xl');
    root.classList.add(`font-scale-${fontScale}`);

    // Reduced motion class
    if (isReduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }, [isHighContrast, fontScale, isReduceMotion]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes modals or shortcuts dialog
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        callbacks?.onCloseModals?.();
        return;
      }

      // Alt key combinations
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            e.preventDefault();
            setIsShortcutsOpen((prev) => !prev);
            announce('Toggled Accessibility & Keyboard Shortcuts Dialog');
            break;
          case 'h':
            e.preventDefault();
            toggleHighContrast();
            break;
          case 'b':
            e.preventDefault();
            callbacks?.onSelectTab?.('budget');
            announce('Navigated to Budget Manager');
            break;
          case 't':
            e.preventDefault();
            callbacks?.onSelectTab?.('timeline');
            announce('Navigated to Timeline & Run of Show');
            break;
          case 'v':
            e.preventDefault();
            callbacks?.onSelectTab?.('vendors');
            announce('Navigated to Vendor Hub');
            break;
          case 'i':
            e.preventDefault();
            callbacks?.onSelectTab?.('ideas');
            announce('Navigated to Creative Ideation Studio');
            break;
          case 'c':
            e.preventDefault();
            callbacks?.onToggleCopilot?.();
            announce('Toggled Celebration Copilot Drawer');
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [callbacks, isShortcutsOpen, toggleHighContrast, announce]);

  return {
    isHighContrast,
    fontScale,
    isReduceMotion,
    isShortcutsOpen,
    announcement,
    toggleHighContrast,
    setFontScale,
    toggleReduceMotion,
    setIsShortcutsOpen,
    announce,
  };
}
