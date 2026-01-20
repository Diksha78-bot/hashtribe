-- Fix Tribe Membership Helper Function and RLS Recursion

-- Drop problematic policies first
DROP POLICY IF EXISTS "Tribe members are viewable by tribe members" ON public.tribe_members;
DROP POLICY IF EXISTS "Private tribes are viewable by members" ON public.tribes;

-- Recreate safe policies using the helper function
CREATE POLICY "Tribe members are viewable by tribe members"
ON public.tribe_members FOR SELECT
USING (public.is_tribe_member(tribe_id));

CREATE POLICY "Private tribes are viewable by members"
ON public.tribes FOR SELECT
USING (
  visibility = 'public' OR 
  (visibility = 'private' AND public.is_tribe_member(id))
);