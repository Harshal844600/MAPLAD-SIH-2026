// ==============================================================================
// MPLAD SENTINEL — SUPABASE & GOOGLE OAUTH SERVICE
// ==============================================================================

import { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './client';
import { UserProfile, UserRole } from '../../types';

export interface AuthStateChangeCallback {
  (event: AuthChangeEvent, session: Session | null, profile?: UserProfile | null): void;
}

/**
 * Initiates Google OAuth Sign-In flow via Supabase.
 * Redirects user to Google Consent Screen and returns them back to the app.
 */
export async function signInWithGoogle(redirectTo?: string): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase || !isSupabaseConfigured) {
    return {
      error: new Error(
        'Supabase Cloud is not configured. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.'
      ),
    };
  }

  try {
    // Generate safe redirect URL targeting current origin and hash route
    const defaultRedirect = `${window.location.origin}${window.location.pathname}#/dashboard`;
    const targetRedirectUrl = redirectTo || defaultRedirect;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: targetRedirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) {
      console.error('Google OAuth sign-in error:', error);
      return { error };
    }

    return { error: null };
  } catch (err: any) {
    console.error('Unexpected error initiating Google OAuth:', err);
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Signs out the currently authenticated user from Supabase.
 */
export async function signOutUser(): Promise<{ error: Error | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { error: null };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Sign-out error from Supabase:', error);
      return { error };
    }
    return { error: null };
  } catch (err: any) {
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * Retrieves the active Supabase session if one exists.
 */
export async function getAuthSession(): Promise<Session | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return data.session;
  } catch (err) {
    console.warn('Failed to retrieve session:', err);
    return null;
  }
}

/**
 * Formats a Supabase User object and user_metadata into an application UserProfile.
 */
export function formatUserProfileFromAuthUser(user: User): UserProfile {
  const meta = user.user_metadata || {};
  const fullName =
    meta.full_name ||
    meta.name ||
    (meta.first_name ? `${meta.first_name} ${meta.last_name || ''}`.trim() : null) ||
    user.email?.split('@')[0] ||
    'Authorized Officer';

  const avatarUrl = meta.avatar_url || meta.picture || undefined;

  // Derive role if stored in metadata or database, default to DISTRICT_OFFICER for demo access
  const role: UserRole = (meta.role as UserRole) || 'DISTRICT_OFFICER';

  return {
    id: user.id,
    email: user.email || 'officer@gov.in',
    full_name: fullName,
    role: role,
    avatar_url: avatarUrl,
    auth_provider: 'google',
    designation: meta.designation || 'District Nodal Officer (Google Verified)',
    department: meta.department || 'MoSPI / District Administration',
    state_id: meta.state_id || 'st-mh',
    state_name: meta.state_name || 'Maharashtra',
    district_id: meta.district_id || 'dst-pune',
    district_name: meta.district_name || 'Pune District',
    constituency_id: meta.constituency_id || 'cst-pune-ls',
    constituency_name: meta.constituency_name || 'Pune Parliamentary Constituency',
  };
}

/**
 * Fetches user profile from PostgreSQL `profiles` table or synthesizes from auth session.
 */
export async function fetchOrCreateUserProfile(user: User): Promise<UserProfile> {
  const supabase = getSupabaseClient();
  const fallbackProfile = formatUserProfileFromAuthUser(user);

  if (!supabase) {
    return fallbackProfile;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, states(name), districts(name), constituencies(name)')
      .eq('id', user.id)
      .maybeSingle();

    if (error || !data) {
      return fallbackProfile;
    }

    return {
      id: data.id,
      email: data.email || user.email || fallbackProfile.email,
      full_name: data.full_name || fallbackProfile.full_name,
      role: (data.role as UserRole) || fallbackProfile.role,
      avatar_url: fallbackProfile.avatar_url,
      auth_provider: 'google',
      designation: data.designation || fallbackProfile.designation,
      department: data.department || fallbackProfile.department,
      state_id: data.state_id,
      state_name: data.states?.name || fallbackProfile.state_name,
      district_id: data.district_id,
      district_name: data.districts?.name || fallbackProfile.district_name,
      constituency_id: data.constituency_id,
      constituency_name: data.constituencies?.name || fallbackProfile.constituency_name,
    };
  } catch (err) {
    console.warn('Error querying profiles table, utilizing auth metadata fallback:', err);
    return fallbackProfile;
  }
}

/**
 * Attaches a real-time listener for auth lifecycle events (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED).
 */
export function onAuthStateChanged(callback: AuthStateChangeCallback): () => void {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return () => {};
  }

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    let profile: UserProfile | null = null;
    if (session?.user) {
      profile = await fetchOrCreateUserProfile(session.user);
    }
    callback(event, session, profile);
  });

  return () => {
    subscription.unsubscribe();
  };
}
