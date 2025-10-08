-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'canceled', 'checked_in', 'completed');

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded');

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,

  -- Participant information
  child_name TEXT NOT NULL,
  child_age INTEGER NOT NULL CHECK (child_age >= 3 AND child_age <= 15),
  guardian_name TEXT NOT NULL,
  guardian_phone TEXT NOT NULL,

  -- Booking details
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ, -- Calculated from start_at + experience duration
  status booking_status NOT NULL DEFAULT 'pending',

  -- Payment information (will be used when Stripe is integrated)
  payment_method TEXT, -- 'credit', 'konbini', 'bank', 'paypay'
  payment_status payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  amount_yen INTEGER NOT NULL,

  -- QR code for check-in
  qr_token TEXT NOT NULL UNIQUE,
  qr_expires_at TIMESTAMPTZ,

  -- Optional information
  notes TEXT,
  coupon_code TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_experience_id ON public.bookings(experience_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_start_at ON public.bookings(start_at);
CREATE INDEX idx_bookings_qr_token ON public.bookings(qr_token);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view bookings for their experiences"
  ON public.bookings FOR SELECT
  USING (
    experience_id IN (
      SELECT e.id FROM public.experiences e
      JOIN public.providers p ON e.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can update bookings for their experiences"
  ON public.bookings FOR UPDATE
  USING (
    experience_id IN (
      SELECT e.id FROM public.experiences e
      JOIN public.providers p ON e.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate booking end_at based on experience duration
CREATE OR REPLACE FUNCTION public.calculate_booking_end_at()
RETURNS TRIGGER AS $$
DECLARE
  exp_duration INTEGER;
BEGIN
  SELECT duration_min INTO exp_duration
  FROM public.experiences
  WHERE id = NEW.experience_id;

  NEW.end_at = NEW.start_at + (exp_duration || ' minutes')::INTERVAL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_end_at
  BEFORE INSERT OR UPDATE OF start_at, experience_id ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.calculate_booking_end_at();
