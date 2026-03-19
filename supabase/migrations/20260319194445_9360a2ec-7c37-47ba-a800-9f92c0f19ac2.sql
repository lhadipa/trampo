
-- Create escrow table
CREATE TABLE public.escrow (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id),
  company_user_id UUID NOT NULL REFERENCES public.users(id),
  freelancer_user_id UUID NOT NULL REFERENCES public.users(id),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'held',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  released_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.escrow ENABLE ROW LEVEL SECURITY;

-- Company and freelancer can see their escrows
CREATE POLICY "Users can see own escrows"
ON public.escrow FOR SELECT TO authenticated
USING (
  company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  OR freelancer_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Company can create escrow (pay upfront)
CREATE POLICY "Company can create escrow"
ON public.escrow FOR INSERT TO authenticated
WITH CHECK (
  company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Company can release escrow (update status)
CREATE POLICY "Company can update escrow"
ON public.escrow FOR UPDATE TO authenticated
USING (
  company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

-- Admins can see all escrows
CREATE POLICY "Admins can see all escrows"
ON public.escrow FOR SELECT TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update escrows (disputes)
CREATE POLICY "Admins can update all escrows"
ON public.escrow FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
