-- 1. Remove full-row exposure of conversation partners
DROP POLICY IF EXISTS "Can read conversation partners" ON public.users;

-- 2. Safe, column-limited view of conversation partners
CREATE OR REPLACE VIEW public.conversation_partners AS
SELECT u.id, u.name, u.type
FROM public.users u
WHERE u.id IN (SELECT public.get_conversation_partner_ids(auth.uid()));

GRANT SELECT ON public.conversation_partners TO authenticated;

-- 3. Revoke direct EXECUTE on SECURITY DEFINER functions (still usable inside policies/views/triggers)
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.get_conversation_partner_ids(uuid) FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.filter_sensitive_content() FROM anon, authenticated;

-- 4. Marketplace listings: keep readable to signed-in users only (no anon access)
REVOKE ALL ON public.companies FROM anon;
REVOKE ALL ON public.freelancers FROM anon;
REVOKE ALL ON public.jobs FROM anon;
REVOKE ALL ON public.reviews FROM anon;
REVOKE ALL ON public.users FROM anon;