-- Implement Safe is_tribe_member Helper Function

CREATE OR REPLACE FUNCTION public.is_tribe_member(_tribe_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tribe_members 
    WHERE tribe_id = _tribe_id AND user_id = auth.uid()
  );
END;
$$;