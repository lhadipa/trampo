DROP VIEW IF EXISTS public.conversation_partners;

CREATE TABLE IF NOT EXISTS public.public_profiles (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.public_profiles TO authenticated;
GRANT ALL ON public.public_profiles TO service_role;

ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles readable by authenticated"
ON public.public_profiles FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.sync_public_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.public_profiles (user_id, name, type)
  VALUES (NEW.id, NEW.name, NEW.type)
  ON CONFLICT (user_id) DO UPDATE
    SET name = EXCLUDED.name, type = EXCLUDED.type, updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.sync_public_profile() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS sync_public_profile_trigger ON public.users;
CREATE TRIGGER sync_public_profile_trigger
AFTER INSERT OR UPDATE OF name, type ON public.users
FOR EACH ROW EXECUTE FUNCTION public.sync_public_profile();

INSERT INTO public.public_profiles (user_id, name, type)
SELECT id, name, type FROM public.users
ON CONFLICT (user_id) DO NOTHING;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_conversation_partner_ids(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.filter_sensitive_content() FROM PUBLIC, anon, authenticated;