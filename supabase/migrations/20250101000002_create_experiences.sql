-- Create experiences table
CREATE TABLE public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_age TEXT NOT NULL, -- e.g., "6-12"
  duration_min INTEGER NOT NULL,
  price_yen INTEGER NOT NULL,
  photos TEXT[] DEFAULT '{}', -- Array of photo URLs
  category TEXT, -- e.g., "STEM", "Art", "Sports"
  max_participants INTEGER DEFAULT 10,
  location_address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_experiences_provider_id ON public.experiences(provider_id);
CREATE INDEX idx_experiences_is_published ON public.experiences(is_published);
CREATE INDEX idx_experiences_category ON public.experiences(category);
CREATE INDEX idx_experiences_price ON public.experiences(price_yen);

-- Enable Row Level Security
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Published experiences are viewable by everyone"
  ON public.experiences FOR SELECT
  USING (is_published = true);

CREATE POLICY "Providers can view their own unpublished experiences"
  ON public.experiences FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can insert their own experiences"
  ON public.experiences FOR INSERT
  WITH CHECK (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update their own experiences"
  ON public.experiences FOR UPDATE
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can delete their own experiences"
  ON public.experiences FOR DELETE
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER set_updated_at_experiences
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
