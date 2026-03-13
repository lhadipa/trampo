
-- Conversations table
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_user_id uuid NOT NULL REFERENCES public.users(id),
  freelancer_user_id uuid NOT NULL REFERENCES public.users(id),
  unlocked boolean NOT NULL DEFAULT false,
  unlock_price numeric NOT NULL DEFAULT 10,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(company_user_id, freelancer_user_id)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see own conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (
    company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    OR freelancer_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Company can create conversation" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (
    company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Company can unlock conversation" ON public.conversations
  FOR UPDATE TO authenticated
  USING (
    company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.users(id),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read messages" ON public.messages
  FOR SELECT TO authenticated
  USING (
    conversation_id IN (
      SELECT c.id FROM conversations c
      WHERE c.company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
         OR c.freelancer_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    )
  );

CREATE POLICY "Participants of unlocked conv can send messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
    AND conversation_id IN (
      SELECT c.id FROM conversations c
      WHERE c.unlocked = true
        AND (c.company_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
          OR c.freelancer_user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()))
    )
  );

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Trigger to filter sensitive info (phone numbers, emails) from messages
CREATE OR REPLACE FUNCTION public.filter_sensitive_content()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Remove phone numbers (Brazilian formats and international)
  NEW.content := regexp_replace(NEW.content, '\+?\d{1,3}[\s\-]?\(?\d{2,3}\)?[\s\-]?\d{4,5}[\s\-]?\d{4}', '[contato bloqueado]', 'g');
  -- Remove sequences of 8+ digits (phone-like)
  NEW.content := regexp_replace(NEW.content, '\d{8,}', '[contato bloqueado]', 'g');
  -- Remove email addresses
  NEW.content := regexp_replace(NEW.content, '[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}', '[contato bloqueado]', 'g');
  -- Remove @ handles
  NEW.content := regexp_replace(NEW.content, '@[a-zA-Z0-9._]{3,}', '[contato bloqueado]', 'g');
  RETURN NEW;
END;
$$;

CREATE TRIGGER filter_message_content
  BEFORE INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.filter_sensitive_content();
