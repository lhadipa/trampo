
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can read their own roles
CREATE POLICY "Users can read own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- RLS: admins can manage all roles
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (auth_id, name, email, type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'freelancer')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add blocked column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS blocked boolean NOT NULL DEFAULT false;

-- Add balance columns to users
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS balance numeric NOT NULL DEFAULT 0;

-- Payments table for tracking
CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id uuid REFERENCES public.users(id) NOT NULL,
  to_user_id uuid REFERENCES public.users(id) NOT NULL,
  job_id uuid REFERENCES public.jobs(id),
  amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Payments RLS
CREATE POLICY "Users can see own payments"
ON public.payments FOR SELECT TO authenticated
USING (
  from_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  OR to_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
);

CREATE POLICY "Admins can see all payments"
ON public.payments FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert payments"
ON public.payments FOR INSERT TO authenticated
WITH CHECK (from_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Allow admins to read all users
CREATE POLICY "Admins can read all users"
ON public.users FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow admins to update all users (for blocking)
CREATE POLICY "Admins can update all users"
ON public.users FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
