import { describe, it, expect } from 'vitest';
import { formatUserProfileFromAuthUser } from '../services/supabase/authService';
import { User } from '@supabase/supabase-js';

describe('Supabase Google Auth Service', () => {
  it('correctly maps Google OAuth user metadata to UserProfile', () => {
    const mockGoogleUser: Partial<User> = {
      id: 'google-user-12345',
      email: 'collector.pune@gov.in',
      user_metadata: {
        full_name: 'Dr. Rajesh Sharma, IAS',
        avatar_url: 'https://lh3.googleusercontent.com/a/mock-avatar',
        designation: 'District Magistrate & Collector',
        department: 'District Administration Pune',
      },
    };

    const profile = formatUserProfileFromAuthUser(mockGoogleUser as User);

    expect(profile.id).toBe('google-user-12345');
    expect(profile.email).toBe('collector.pune@gov.in');
    expect(profile.full_name).toBe('Dr. Rajesh Sharma, IAS');
    expect(profile.avatar_url).toBe('https://lh3.googleusercontent.com/a/mock-avatar');
    expect(profile.auth_provider).toBe('google');
    expect(profile.role).toBe('DISTRICT_OFFICER');
  });

  it('provides safe fallbacks when Google metadata is sparse', () => {
    const sparseGoogleUser: Partial<User> = {
      id: 'google-user-999',
      email: 'auditor.cag@nic.in',
      user_metadata: {},
    };

    const profile = formatUserProfileFromAuthUser(sparseGoogleUser as User);

    expect(profile.id).toBe('google-user-999');
    expect(profile.email).toBe('auditor.cag@nic.in');
    expect(profile.full_name).toBe('auditor.cag');
    expect(profile.auth_provider).toBe('google');
    expect(profile.role).toBe('DISTRICT_OFFICER');
  });
});
