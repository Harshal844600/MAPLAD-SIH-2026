import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { ClassicalCard } from './ClassicalCard';
import { ClassicalButton } from './ClassicalButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-6">
          <ClassicalCard
            variant="red"
            className="max-w-lg w-full text-center py-8 px-6 space-y-4 relative border-beam-card border-red-500/40"
          >
            <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center border border-red-500/40 rounded-2xl bg-red-950/40 text-red-400">
              <AlertOctagon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold font-serif text-white light:text-slate-900">
              Archive Access Interrupted
            </h3>
            <p className="text-xs text-zinc-400 light:text-slate-600 leading-relaxed font-sans">
              We encountered an issue rendering this subsystem view. Your encrypted ledger records remain secure.
            </p>
            <div className="pt-2">
              <ClassicalButton
                variant="secondary"
                size="sm"
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                RELOAD ARCHIVE
              </ClassicalButton>
            </div>
          </ClassicalCard>
        </div>
      );
    }

    return this.props.children;
  }
}
