
-- Users table (profiles)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('company', 'freelancer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.users FOR SELECT TO authenticated USING (auth_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE TO authenticated USING (auth_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT TO authenticated WITH CHECK (auth_id = auth.uid());

-- Companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Companies readable by authenticated" ON public.companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Company owner can insert" ON public.companies FOR INSERT TO authenticated WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "Company owner can update" ON public.companies FOR UPDATE TO authenticated USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Freelancers table
CREATE TABLE public.freelancers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.freelancers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers readable by authenticated" ON public.freelancers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Freelancer owner can insert" ON public.freelancers FOR INSERT TO authenticated WITH CHECK (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
CREATE POLICY "Freelancer owner can update" ON public.freelancers FOR UPDATE TO authenticated USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Jobs table
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  price NUMERIC(10,2),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  urgent BOOLEAN NOT NULL DEFAULT false,
  boost BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jobs readable by authenticated" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "Company owner can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (company_id IN (SELECT c.id FROM public.companies c JOIN public.users u ON c.user_id = u.id WHERE u.auth_id = auth.uid()));
CREATE POLICY "Company owner can update jobs" ON public.jobs FOR UPDATE TO authenticated USING (company_id IN (SELECT c.id FROM public.companies c JOIN public.users u ON c.user_id = u.id WHERE u.auth_id = auth.uid()));

-- Applications table
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES public.freelancers(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, freelancer_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Applications readable by involved parties" ON public.applications FOR SELECT TO authenticated USING (
  freelancer_id IN (SELECT f.id FROM public.freelancers f JOIN public.users u ON f.user_id = u.id WHERE u.auth_id = auth.uid())
  OR job_id IN (SELECT j.id FROM public.jobs j JOIN public.companies c ON j.company_id = c.id JOIN public.users u ON c.user_id = u.id WHERE u.auth_id = auth.uid())
);
CREATE POLICY "Freelancer can apply" ON public.applications FOR INSERT TO authenticated WITH CHECK (freelancer_id IN (SELECT f.id FROM public.freelancers f JOIN public.users u ON f.user_id = u.id WHERE u.auth_id = auth.uid()));

-- Reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  to_user UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews readable by authenticated" ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY "User can insert own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (from_user IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));
