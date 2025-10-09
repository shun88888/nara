-- Create time_slots table for managing availability
CREATE TABLE public.time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id UUID NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,

  -- Date and time
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,

  -- Availability
  max_capacity INTEGER NOT NULL DEFAULT 1,
  current_bookings INTEGER NOT NULL DEFAULT 0,

  -- Status
  is_available BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure no overlapping slots for the same experience
  CONSTRAINT unique_experience_datetime UNIQUE (experience_id, date, start_time)
);

-- Create indexes
CREATE INDEX idx_time_slots_experience_id ON public.time_slots(experience_id);
CREATE INDEX idx_time_slots_date ON public.time_slots(date);
CREATE INDEX idx_time_slots_is_available ON public.time_slots(is_available);
CREATE INDEX idx_time_slots_experience_date ON public.time_slots(experience_id, date);

-- Enable Row Level Security
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view available time slots"
  ON public.time_slots FOR SELECT
  USING (is_available = true);

CREATE POLICY "Providers can view all their time slots"
  ON public.time_slots FOR SELECT
  USING (
    experience_id IN (
      SELECT e.id FROM public.experiences e
      JOIN public.providers p ON e.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can insert time slots for their experiences"
  ON public.time_slots FOR INSERT
  WITH CHECK (
    experience_id IN (
      SELECT e.id FROM public.experiences e
      JOIN public.providers p ON e.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can update their time slots"
  ON public.time_slots FOR UPDATE
  USING (
    experience_id IN (
      SELECT e.id FROM public.experiences e
      JOIN public.providers p ON e.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can delete their time slots"
  ON public.time_slots FOR DELETE
  USING (
    experience_id IN (
      SELECT e.id FROM public.experiences e
      JOIN public.providers p ON e.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at
CREATE TRIGGER set_updated_at_time_slots
  BEFORE UPDATE ON public.time_slots
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to get available slots count for a date
CREATE OR REPLACE FUNCTION public.get_available_slots_for_date(
  p_experience_id UUID,
  p_date DATE
)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.time_slots
    WHERE experience_id = p_experience_id
      AND date = p_date
      AND is_available = true
      AND current_bookings < max_capacity
  );
END;
$$ LANGUAGE plpgsql;

-- Function to increment booking count when a booking is created
CREATE OR REPLACE FUNCTION public.increment_time_slot_bookings()
RETURNS TRIGGER AS $$
DECLARE
  slot_date DATE;
  slot_start_time TIME;
BEGIN
  -- Extract date and time from start_at
  slot_date := NEW.start_at::DATE;
  slot_start_time := NEW.start_at::TIME;

  -- Increment current_bookings for the matching time slot
  UPDATE public.time_slots
  SET current_bookings = current_bookings + 1
  WHERE experience_id = NEW.experience_id
    AND date = slot_date
    AND start_time = slot_start_time;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_slot_on_booking
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  WHEN (NEW.status != 'canceled')
  EXECUTE FUNCTION public.increment_time_slot_bookings();

-- Function to decrement booking count when a booking is canceled
CREATE OR REPLACE FUNCTION public.decrement_time_slot_bookings()
RETURNS TRIGGER AS $$
DECLARE
  slot_date DATE;
  slot_start_time TIME;
BEGIN
  -- Only decrement if status changed to canceled
  IF OLD.status != 'canceled' AND NEW.status = 'canceled' THEN
    slot_date := OLD.start_at::DATE;
    slot_start_time := OLD.start_at::TIME;

    UPDATE public.time_slots
    SET current_bookings = GREATEST(0, current_bookings - 1)
    WHERE experience_id = OLD.experience_id
      AND date = slot_date
      AND start_time = slot_start_time;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER decrement_slot_on_cancel
  AFTER UPDATE ON public.bookings
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public.decrement_time_slot_bookings();

-- View to get available time slots with remaining capacity
CREATE OR REPLACE VIEW public.available_time_slots AS
SELECT
  ts.id,
  ts.experience_id,
  ts.date,
  ts.start_time,
  ts.end_time,
  ts.max_capacity,
  ts.current_bookings,
  (ts.max_capacity - ts.current_bookings) AS remaining_capacity,
  ts.is_available
FROM public.time_slots ts
WHERE ts.is_available = true
  AND ts.current_bookings < ts.max_capacity
  AND ts.date >= CURRENT_DATE
ORDER BY ts.date, ts.start_time;
