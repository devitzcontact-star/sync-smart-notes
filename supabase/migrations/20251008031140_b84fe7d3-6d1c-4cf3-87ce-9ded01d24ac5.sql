-- Add is_public column to notes table to allow sharing
ALTER TABLE public.notes
ADD COLUMN is_public boolean DEFAULT false;

-- Create a policy to allow anyone to view public notes
CREATE POLICY "Anyone can view public notes"
ON public.notes
FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Update the existing policy name to be more specific
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;

CREATE POLICY "Users can view own notes"
ON public.notes
FOR SELECT
USING (auth.uid() = user_id);

-- Add view count for public notes
ALTER TABLE public.notes
ADD COLUMN view_count integer DEFAULT 0;

-- Add slug for public note URLs
ALTER TABLE public.notes
ADD COLUMN slug text UNIQUE;

-- Create index on slug for faster lookups
CREATE INDEX idx_notes_slug ON public.notes(slug);

-- Create index on is_public for faster filtering
CREATE INDEX idx_notes_public ON public.notes(is_public) WHERE is_public = true;