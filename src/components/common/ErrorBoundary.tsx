import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, RotateCcw } from 'lucide-react';
import { Button } from './Button';
import { weddingPreset } from '../../data/defaultPresets';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Enterprise-grade React Error Boundary component for CelebrationOS.
 * Catches JavaScript errors anywhere in their child component tree,
 * logs errors gracefully, and displays a resilient fallback UI.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('CelebrationOS Uncaught Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleResetState = (): void => {
    try {
      localStorage.removeItem('celebration_os_active_project');
      localStorage.setItem('celebration_os_active_project', JSON.stringify(weddingPreset));
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
          <div className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-rose-200 dark:border-rose-900/60 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold tracking-tight">
                CelebrationOS Encountered an Issue
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                A component error was safely caught by the application runtime boundary. Your planned event data is intact in local storage.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left p-3.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={this.handleReload}
                icon={<RefreshCw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Reload Window
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={this.handleResetState}
                icon={<RotateCcw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Reset Default Preset
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
