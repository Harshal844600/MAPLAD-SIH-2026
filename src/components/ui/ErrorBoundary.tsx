import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { ClassicalCard } from './ClassicalCard';
import { ClassicalButton } from './ClassicalButton';
import { CornerFlourish } from './CornerFlourish';

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
            className="max-w-lg w-full text-center py-8 px-6 space-y-4 relative"
          >
            <CornerFlourish size="md" color="#8B2635" />
            <div className="w-14 h-14 mx-auto mb-2 flex items-center justify-center border border-[#8B2635] rounded-full bg-[#1C1714] text-[#fca5a5]">
              <AlertOctagon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold font-['Cormorant_Garamond'] text-[#fca5a5]">
              ARCHIVE ACCESS INTERRUPTED
            </h3>
            <p className="text-sm text-[#9C8B7A] font-['Crimson_Pro'] italic leading-relaxed">
              We could not retrieve or render the requested archive record. Your ledger records remain secure.
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
