-- Fix User Profile Sync Trigger

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
BEGIN
  -- Extract username from GitHub metadata
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'user_name',
    NEW.raw_user_meta_data->>'username', 
    SPLIT_PART(NEW.email, '@', 1)
  );
  
  -- Sanitize and create unique username
  base_username := REGEXP_REPLACE(base_username, '[^a-zA-Z0-9_-]', '', 'g');
  final_username := SUBSTRING(base_username FROM 1 FOR 15) || '_' || RIGHT(NEW.id::text, 4);

  INSERT INTO public.users (
    id, username, display_name, avatar_url, github_username, github_id
  ) VALUES (
    NEW.id,
    final_username,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'user_name',
    (NEW.raw_user_meta_data->>'provider_id')::BIGINT
  ) ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();