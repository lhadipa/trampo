-- Update default unlock price to 4.90
ALTER TABLE public.conversations ALTER COLUMN unlock_price SET DEFAULT 4.90;

-- Update existing conversations that still have the old default
UPDATE public.conversations SET unlock_price = 4.90 WHERE unlock_price = 10;