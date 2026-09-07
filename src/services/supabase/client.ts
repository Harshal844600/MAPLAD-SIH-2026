import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('supabase.co') &&
  supabaseAnonKey !== 'your-anon-key'
);

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (!clientInstance) {
    try {
      clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase Cloud client:', err);
      return null;
    }
  }

  return clientInstance;
};

export interface SupabaseHealthCheckResult {
  isConfigured: boolean;
  connected: boolean;
  latencyMs: number | null;
  url: string;
  error?: string;
}

export const checkSupabaseHealth = async (): Promise<SupabaseHealthCheckResult> => {
  if (!isSupabaseConfigured) {
    return {
      isConfigured: false,
      connected: false,
      latencyMs: null,
      url: supabaseUrl || 'Not configured in .env',
      error: 'VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing or using placeholder values',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      isConfigured: true,
      connected: false,
      latencyMs: null,
      url: supabaseUrl,
      error: 'Client initialization failed',
    };
  }

  const startTime = performance.now();
  try {
    // Attempt a lightweight ping query
    const { error } = await client.from('detection_rules').select('rule_code').limit(1);
    const latencyMs = Math.round(performance.now() - startTime);

    if (error) {
      // If table doesn't exist yet, it's still reachable
      if (error.code === '42P01') {
        return {
          isConfigured: true,
          connected: true,
          latencyMs,
          url: supabaseUrl,
          error: 'Connected to Supabase! Schema tables not yet seeded. Run full_schema_and_seed.sql in SQL Editor.',
        };
      }
      return {
        isConfigured: true,
        connected: false,
        latencyMs,
        url: supabaseUrl,
        error: error.message,
      };
    }

    return {
      isConfigured: true,
      connected: true,
      latencyMs,
      url: supabaseUrl,
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      connected: false,
      latencyMs: null,
      url: supabaseUrl,
      error: err?.message || 'Network unreachable',
    };
  }
};
