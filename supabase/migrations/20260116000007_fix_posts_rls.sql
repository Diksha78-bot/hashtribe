-- Fix Posts RLS Policy Recursion Issue

-- Create safe helper function
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

-- Drop problematic policies
DROP POLICY IF EXISTS "Users can create posts in tribes they are members of" ON public.posts;

-- Create fixed policy
CREATE POLICY "Users can create posts in tribes they are members of" 
ON public.posts FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND 
  public.is_tribe_member(tribe_id)
);