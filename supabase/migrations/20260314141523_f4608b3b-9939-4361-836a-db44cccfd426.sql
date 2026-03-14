-- Allow authenticated users to read basic user info (name, type) for chat participants
-- This is needed so conversation participants can see each other's names
CREATE POLICY "Authenticated can read user names"
ON public.users FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT c.company_user_id FROM conversations c
    WHERE c.freelancer_user_id IN (SELECT u.id FROM users u WHERE u.auth_id = auth.uid())
    UNION
    SELECT c.freelancer_user_id FROM conversations c
    WHERE c.company_user_id IN (SELECT u.id FROM users u WHERE u.auth_id = auth.uid())
  )
);

-- Create the trigger for filtering sensitive content on messages
CREATE OR REPLACE TRIGGER filter_messages_content
BEFORE INSERT ON public.messages
FOR EACH ROW
EXECUTE FUNCTION filter_sensitive_content();