CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), auth_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL UNIQUE, type text NOT NULL CHECK (type IN ('company','freelancer','empresa','admin')),
  password_hash text, blocked boolean NOT NULL DEFAULT false, balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_roles (user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, role text NOT NULL DEFAULT 'user');
CREATE TABLE IF NOT EXISTS companies (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, name text NOT NULL, corporate_name text, cnpj text, preferred_service_types text[] NOT NULL DEFAULT '{}', bio text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS individual_contractors (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, full_name text NOT NULL, cpf text NOT NULL UNIQUE, preferred_service_types text[] NOT NULL DEFAULT '{}', bio text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE companies ADD COLUMN IF NOT EXISTS preferred_service_types text[] NOT NULL DEFAULT '{}';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
ALTER TABLE individual_contractors ADD COLUMN IF NOT EXISTS preferred_service_types text[] NOT NULL DEFAULT '{}';
ALTER TABLE individual_contractors ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS freelancers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, category text NOT NULL, service_types text[] NOT NULL DEFAULT '{}', work_types text[] NOT NULL DEFAULT '{}', experience_years integer NOT NULL DEFAULT 0, bio text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS service_types text[] NOT NULL DEFAULT '{}';
ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS work_types text[] NOT NULL DEFAULT '{}';
ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS experience_years integer NOT NULL DEFAULT 0;
ALTER TABLE freelancers ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '';
CREATE TABLE IF NOT EXISTS preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  location_id text NOT NULL,
  category_id text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  removed_at timestamptz,
  UNIQUE(user_id, location_id, category_id)
);
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '', description text, date timestamptz NOT NULL, price numeric(10,2),
  payment_type text NOT NULL DEFAULT 'service' CHECK (payment_type IN ('service', 'hourly')),
  service_price numeric(10,2), hourly_rate numeric(10,2),
  status text NOT NULL DEFAULT 'open', urgent boolean NOT NULL DEFAULT false, boost boolean NOT NULL DEFAULT false,
  location text, category text, created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS payment_type text NOT NULL DEFAULT 'service';
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS service_price numeric(10,2);
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS hourly_rate numeric(10,2);
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id uuid NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(job_id, freelancer_id)
);
CREATE TABLE IF NOT EXISTS conversations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_user_id uuid NOT NULL REFERENCES users(id), freelancer_user_id uuid NOT NULL REFERENCES users(id), unlock_price numeric NOT NULL DEFAULT 4.90, unlocked boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(company_user_id, freelancer_user_id));
CREATE TABLE IF NOT EXISTS messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE, sender_id uuid NOT NULL REFERENCES users(id), content text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id), from_user_id uuid REFERENCES users(id), to_user_id uuid REFERENCES users(id), job_id uuid REFERENCES jobs(id), amount numeric NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'pending', service text, created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE payments ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES users(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS from_user_id uuid REFERENCES users(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS to_user_id uuid REFERENCES users(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS job_id uuid REFERENCES jobs(id);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS service text;
ALTER TABLE payments ALTER COLUMN from_user_id DROP NOT NULL;
ALTER TABLE payments ALTER COLUMN to_user_id DROP NOT NULL;
CREATE TABLE IF NOT EXISTS escrow (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid REFERENCES jobs(id), company_id uuid REFERENCES companies(id), freelancer_id uuid REFERENCES freelancers(id), company_user_id uuid REFERENCES users(id), freelancer_user_id uuid REFERENCES users(id), amount numeric NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'held', service text, released_at timestamptz, created_at timestamptz NOT NULL DEFAULT now());
ALTER TABLE escrow ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES companies(id);
ALTER TABLE escrow ADD COLUMN IF NOT EXISTS freelancer_id uuid REFERENCES freelancers(id);
ALTER TABLE escrow ADD COLUMN IF NOT EXISTS company_user_id uuid REFERENCES users(id);
ALTER TABLE escrow ADD COLUMN IF NOT EXISTS freelancer_user_id uuid REFERENCES users(id);
ALTER TABLE escrow ADD COLUMN IF NOT EXISTS released_at timestamptz;
CREATE TABLE IF NOT EXISTS reviews (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), from_user uuid REFERENCES users(id), to_user uuid REFERENCES users(id), rating integer NOT NULL, comment text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public_profiles (user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, name text NOT NULL, type text NOT NULL);
CREATE TABLE IF NOT EXISTS proposals (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT, application_id uuid NOT NULL UNIQUE REFERENCES applications(id) ON DELETE RESTRICT, company_id uuid NOT NULL REFERENCES companies(id) ON DELETE RESTRICT, freelancer_id uuid NOT NULL REFERENCES freelancers(id) ON DELETE RESTRICT, amount numeric(10,2) NOT NULL DEFAULT 0 CHECK (amount >= 0), start_at timestamptz NOT NULL, end_at timestamptz NOT NULL, description text, status text NOT NULL DEFAULT 'PENDING', created_at timestamptz NOT NULL DEFAULT now(), accepted_at timestamptz, rejected_at timestamptz);
CREATE TABLE IF NOT EXISTS contracts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid NOT NULL REFERENCES jobs(id), company_id uuid NOT NULL REFERENCES companies(id), freelancer_id uuid NOT NULL REFERENCES freelancers(id), proposal_id uuid UNIQUE REFERENCES proposals(id), amount numeric NOT NULL DEFAULT 0, platform_fee numeric NOT NULL DEFAULT 0, freelancer_amount numeric NOT NULL DEFAULT 0, start_at timestamptz, end_at timestamptz, location text, description text, status text NOT NULL DEFAULT 'PENDING', payment_id uuid REFERENCES payments(id), escrow_id uuid REFERENCES escrow(id), created_at timestamptz NOT NULL DEFAULT now(), accepted_at timestamptz, started_at timestamptz, completed_at timestamptz, cancelled_at timestamptz);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS platform_fee numeric NOT NULL DEFAULT 0;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS payment_id uuid REFERENCES payments(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS escrow_id uuid REFERENCES escrow(id);
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS accepted_at timestamptz;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS started_at timestamptz;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS completed_at timestamptz;
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
CREATE TABLE IF NOT EXISTS checkins (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid REFERENCES contracts(id), freelancer_id uuid REFERENCES freelancers(id), method text NOT NULL, status text NOT NULL DEFAULT 'CONFIRMED', metadata jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(contract_id, freelancer_id));

CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON jobs(company_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
CREATE INDEX IF NOT EXISTS preferences_user_active_idx ON preferences(user_id) WHERE active;
