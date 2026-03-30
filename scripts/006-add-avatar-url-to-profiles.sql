-- Add avatar_url to profiles if missing
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Optional: also keep a single canonical name column for UI consistency
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS name TEXT;
