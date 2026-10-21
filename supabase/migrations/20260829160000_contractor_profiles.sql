-- Perfis de quem contrata: empresa ou pessoa física.
-- A tabela companies permanece compatível com jobs e contratos existentes.
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_type_check;
ALTER TABLE public.users ADD CONSTRAINT users_type_check CHECK (type IN ('company', 'freelancer', 'empresa', 'admin'));
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS corporate_name text, ADD COLUMN IF NOT EXISTS cnpj text;
UPDATE public.companies SET corporate_name = name WHERE corporate_name IS NULL;
CREATE TABLE IF NOT EXISTS public.individual_contractors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  full_name text NOT NULL, cpf text NOT NULL, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT individual_contractors_cpf_unique UNIQUE (cpf)
);
ALTER TABLE public.individual_contractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Individual contractors readable by authenticated" ON public.individual_contractors FOR SELECT TO authenticated USING (true);
CREATE POLICY "Individual contractor owner can insert" ON public.individual_contractors FOR INSERT TO authenticated WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "Individual contractor owner can update" ON public.individual_contractors FOR UPDATE TO authenticated USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())) WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE UNIQUE INDEX IF NOT EXISTS companies_cnpj_unique ON public.companies (cnpj) WHERE cnpj IS NOT NULL AND cnpj <> '';

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_type text := COALESCE(NEW.raw_user_meta_data->>'user_type', 'freelancer'); contractor_type text := COALESCE(NEW.raw_user_meta_data->>'contractor_type', 'company'); profile_id uuid;
BEGIN
  INSERT INTO public.users (auth_id, name, email, type) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), NEW.email, user_type) RETURNING id INTO profile_id;
  IF user_type IN ('empresa', 'company') AND contractor_type = 'pessoa_fisica' THEN
    INSERT INTO public.individual_contractors (user_id, full_name, cpf) VALUES (profile_id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), COALESCE(NEW.raw_user_meta_data->>'cpf', 'PENDENTE'));
  ELSIF user_type IN ('empresa', 'company') THEN
    INSERT INTO public.companies (user_id, name, corporate_name, cnpj) VALUES (profile_id, COALESCE(NEW.raw_user_meta_data->>'corporate_name', NEW.raw_user_meta_data->>'name', 'Minha empresa'), COALESCE(NEW.raw_user_meta_data->>'corporate_name', NEW.raw_user_meta_data->>'name', 'Minha empresa'), NULLIF(NEW.raw_user_meta_data->>'cnpj', ''));
  END IF;
  RETURN NEW;
END;
$$;
