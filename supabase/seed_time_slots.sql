-- Seed time slots for existing experiences
-- This script creates time slots for the next 30 days

DO $$
DECLARE
  exp RECORD;
  day_offset INTEGER;
  slot_date DATE;
BEGIN
  -- Loop through all published experiences
  FOR exp IN SELECT id FROM public.experiences WHERE is_published = true LOOP
    -- Create slots for next 30 days
    FOR day_offset IN 0..29 LOOP
      slot_date := CURRENT_DATE + day_offset;

      -- Skip if it's a Sunday (day 0) - businesses might be closed
      IF EXTRACT(DOW FROM slot_date) != 0 THEN
        -- Morning slot: 10:00-12:00
        INSERT INTO public.time_slots (
          experience_id,
          date,
          start_time,
          end_time,
          max_capacity,
          current_bookings,
          is_available
        ) VALUES (
          exp.id,
          slot_date,
          '10:00'::TIME,
          '12:00'::TIME,
          3,
          0,
          true
        ) ON CONFLICT (experience_id, date, start_time) DO NOTHING;

        -- Afternoon slot: 13:00-15:00
        INSERT INTO public.time_slots (
          experience_id,
          date,
          start_time,
          end_time,
          max_capacity,
          current_bookings,
          is_available
        ) VALUES (
          exp.id,
          slot_date,
          '13:00'::TIME,
          '15:00'::TIME,
          4,
          0,
          true
        ) ON CONFLICT (experience_id, date, start_time) DO NOTHING;

        -- Evening slot: 15:30-17:30 (only on weekdays)
        IF EXTRACT(DOW FROM slot_date) BETWEEN 1 AND 5 THEN
          INSERT INTO public.time_slots (
            experience_id,
            date,
            start_time,
            end_time,
            max_capacity,
            current_bookings,
            is_available
          ) VALUES (
            exp.id,
            slot_date,
            '15:30'::TIME,
            '17:30'::TIME,
            2,
            0,
            true
          ) ON CONFLICT (experience_id, date, start_time) DO NOTHING;
        END IF;
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'Time slots created successfully';
END $$;
