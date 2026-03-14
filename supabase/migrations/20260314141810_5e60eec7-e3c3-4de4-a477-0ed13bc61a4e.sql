-- Drop the recursive policy
DROP POLICY IF EXISTS "Authenticated can read user names" ON public.users;

-- Create a security definer function to get conversation partner IDs
CREATE OR REPLACE FUNCTION public.get_conversation_partner_ids(_auth_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.freelancer_user_id FROM conversations c
  JOIN users u ON u.id = c.company_user_id WHERE u.auth_id = _auth_id
  UNION
  SELECT c.company_user_id FROM conversations c
  JOIN users u ON u.id = c.freelancer_user_id WHERE u.auth_id = _auth_id
$$;

-- Policy using the security definer function (no recursion)
CREATE POLICY "Can read conversation partners"
ON public.users FOR SELECT
TO authenticated
USING (id IN (SELECT get_conversation_partner_ids(auth.uid())));