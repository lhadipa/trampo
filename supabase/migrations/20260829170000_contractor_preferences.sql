-- Preferências e apresentação pública de quem contrata.
ALTER TABLE public.companies
  ADD COLUMN IF NOT EXISTS preferred_service_types text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';

ALTER TABLE public.individual_contractors
  ADD COLUMN IF NOT EXISTS preferred_service_types text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
