-- ==============================================================================
-- MPLAD SENTINEL — GOOGLE OAUTH AUTOMATIC PROFILE PROVISIONING TRIGGER
-- ==============================================================================

-- 1. Ensure avatar_url and auth_provider columns exist on profiles table
ALTER TABLE IF EXISTS profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS auth_provider TEXT DEFAULT 'email';

-- 2. Trigger function to handle newly registered Supabase / Google OAuth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    user_full_name TEXT;
    user_avatar TEXT;
    assigned_role public.user_role;
BEGIN
    -- Extract full name from metadata or fallback to email prefix
    user_full_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'name',
        split_part(NEW.email, '@', 1)
    );

    -- Extract avatar URL from Google OAuth metadata
    user_avatar := COALESCE(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'picture'
    );

    -- Set default role (DISTRICT_OFFICER for demo evaluators, or VIEWER)
    assigned_role := 'DISTRICT_OFFICER';

    -- Insert or update matching profile
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        role,
        avatar_url,
        auth_provider,
        designation,
        department,
        is_active,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        user_full_name,
        assigned_role,
        user_avatar,
        COALESCE(NEW.raw_app_meta_data->>'provider', 'google'),
        'District Nodal Officer (Google Verified)',
        'Ministry of Statistics & Programme Implementation',
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        auth_provider = EXCLUDED.auth_provider,
        updated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create or replace trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
