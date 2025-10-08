-- Create providers table
CREATE TABLE public.providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  website_url TEXT,
  logo_url TEXT,
  stripe_account_id TEXT, -- For future Stripe Connect integration
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_providers_user_id ON public.providers(user_id);
CREATE INDEX idx_providers_is_active ON public.providers(is_active);

-- Enable Row Level Security
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Providers are viewable by everyone"
  ON public.providers FOR SELECT
  USING (is_active = true);

CREATE POLICY "Providers can view their own inactive data"
  ON public.providers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can insert their own data"
  ON public.providers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can update their own data"
  ON public.providers FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger to update updated_at
CREATE TRIGGER set_updated_at_providers
  BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to check if user is a provider
CREATE OR REPLACE FUNCTION public.is_provider(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_uuid AND role = 'provider'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
