// ==============================================================================
// MPLAD SENTINEL — GOOGLE SIGN IN BUTTON COMPONENT
// ==============================================================================

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { signInWithGoogle } from '../../services/supabase/authService';

interface GoogleSignInButtonProps {
  className?: string;
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
  variant?: 'primary' | 'secondary' | 'compact';
  label?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  className = '',
  redirectTo,
  onSuccess,
  onError,
  variant = 'primary',
  label = 'Sign in with Google',
}) => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle(redirectTo);
      if (error) {
        if (onError) onError(error);
        else console.warn('Google Sign In failed:', error.message);
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      if (onError) onError(err);
    } finally {
      setLoading(false);
    }
  };

  const isCompact = variant === 'compact';

  return (
    <button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      className={`relative inline-flex items-center justify-center gap-3 font-['Inter'] font-semibold rounded-full transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none ${
        variant === 'primary'
          ? 'bg-white hover:bg-gray-100 text-gray-900 px-5 py-2.5 text-sm shadow-[0_4px_14px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.15)] border border-gray-200 hover:scale-[1.02] active:scale-[0.98]'
          : variant === 'secondary'
          ? 'bg-white/[0.06] hover:bg-white/[0.12] text-white px-4 py-2 text-xs border border-white/15 hover:border-[#a78b71]/60 shadow-xs'
          : 'p-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#a78b71]/60 text-white rounded-full'
      } ${className}`}
      title={label}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-600 dark:text-gray-300" />
      ) : (
        <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      )}

      {!isCompact && <span>{loading ? 'Authenticating...' : label}</span>}
    </button>
  );
};
