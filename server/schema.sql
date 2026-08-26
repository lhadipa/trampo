CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), auth_id uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL UNIQUE, type text NOT NULL CHECK (type IN ('company','freelancer','empresa','admin')),
  password_hash text, blocked boolean NOT NULL DEFAULT false, balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS user_roles (user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, role text NOT NULL DEFAULT 'user');
CREATE TABLE IF NOT EXISTS companies (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, name text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS freelancers (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, category text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '', description text, date timestamptz NOT NULL, price numeric(10,2),
  status text NOT NULL DEFAULT 'open', urgent boolean NOT NULL DEFAULT false, boost boolean NOT NULL DEFAULT false,
  location text, category text, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  freelancer_id uuid NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE, status text NOT NULL DEFAULT 'pending', created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(job_id, freelancer_id)
);
CREATE TABLE IF NOT EXISTS conversations (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), company_user_id uuid NOT NULL REFERENCES users(id), freelancer_user_id uuid NOT NULL REFERENCES users(id), unlock_price numeric NOT NULL DEFAULT 4.90, unlocked boolean NOT NULL DEFAULT false, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(company_user_id, freelancer_user_id));
CREATE TABLE IF NOT EXISTS messages (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE, sender_id uuid NOT NULL REFERENCES users(id), content text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS payments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid REFERENCES users(id), amount numeric NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'pending', service text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS escrow (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid REFERENCES jobs(id), company_id uuid REFERENCES companies(id), freelancer_id uuid REFERENCES freelancers(id), amount numeric NOT NULL DEFAULT 0, status text NOT NULL DEFAULT 'held', service text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS reviews (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), from_user uuid REFERENCES users(id), to_user uuid REFERENCES users(id), rating integer NOT NULL, comment text, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS public_profiles (user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, name text NOT NULL, type text NOT NULL);
CREATE TABLE IF NOT EXISTS contracts (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), job_id uuid NOT NULL REFERENCES jobs(id), company_id uuid NOT NULL REFERENCES companies(id), freelancer_id uuid NOT NULL REFERENCES freelancers(id), proposal_id uuid, amount numeric NOT NULL DEFAULT 0, freelancer_amount numeric NOT NULL DEFAULT 0, start_at timestamptz, end_at timestamptz, description text, status text NOT NULL DEFAULT 'PENDING', created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS checkins (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), contract_id uuid REFERENCES contracts(id), freelancer_id uuid REFERENCES freelancers(id), method text NOT NULL, status text NOT NULL DEFAULT 'CONFIRMED', metadata jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(contract_id, freelancer_id));

CREATE INDEX IF NOT EXISTS jobs_company_id_idx ON jobs(company_id);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status);
