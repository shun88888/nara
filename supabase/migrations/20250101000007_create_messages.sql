-- Create conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One conversation per booking
  CONSTRAINT unique_booking_conversation UNIQUE (booking_id)
);

-- Create sender type enum
CREATE TYPE sender_type AS ENUM ('user', 'provider');

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sender_type sender_type NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_conversations_booking_id ON public.conversations(booking_id);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_provider_id ON public.conversations(provider_id);
CREATE INDEX idx_conversations_last_message_at ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON public.messages(is_read);

-- Enable Row Level Security
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for conversations
CREATE POLICY "Users can view their own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Providers can view their conversations"
  ON public.conversations FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM public.providers WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert conversations for their bookings"
  ON public.conversations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    booking_id IN (SELECT id FROM public.bookings WHERE user_id = auth.uid())
  );

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.providers p ON c.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    sender_type = 'user' AND
    conversation_id IN (
      SELECT id FROM public.conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can send messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    sender_type = 'provider' AND
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.providers p ON c.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can mark their messages as read"
  ON public.messages FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Providers can mark their messages as read"
  ON public.messages FOR UPDATE
  USING (
    conversation_id IN (
      SELECT c.id FROM public.conversations c
      JOIN public.providers p ON c.provider_id = p.id
      WHERE p.user_id = auth.uid()
    )
  );

-- Trigger to update updated_at on conversations
CREATE TRIGGER set_updated_at_conversations
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to update last_message_at when a new message is sent
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_last_message_at
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- Function to get or create conversation for a booking
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(
  p_booking_id UUID
)
RETURNS UUID AS $$
DECLARE
  v_conversation_id UUID;
  v_user_id UUID;
  v_provider_id UUID;
BEGIN
  -- Get existing conversation
  SELECT id INTO v_conversation_id
  FROM public.conversations
  WHERE booking_id = p_booking_id;

  IF v_conversation_id IS NOT NULL THEN
    RETURN v_conversation_id;
  END IF;

  -- Get user_id and provider_id from booking
  SELECT b.user_id, e.provider_id INTO v_user_id, v_provider_id
  FROM public.bookings b
  JOIN public.experiences e ON b.experience_id = e.id
  WHERE b.id = p_booking_id;

  IF v_user_id IS NULL OR v_provider_id IS NULL THEN
    RAISE EXCEPTION 'Booking not found';
  END IF;

  -- Create new conversation
  INSERT INTO public.conversations (booking_id, user_id, provider_id)
  VALUES (p_booking_id, v_user_id, v_provider_id)
  RETURNING id INTO v_conversation_id;

  RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
