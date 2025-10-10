import { supabase } from '../lib/supabase';

export async function ensureConversationForBooking(bookingId: string): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.rpc('ensure_conversation', { p_booking_id: bookingId });
  if (error) throw new Error(error.message);
  return data as string;
}

export async function fetchMessages(conversationId: string, limit = 50) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function sendMessage(conversationId: string, text: string, senderId: string) {
  const content = text.trim();
  if (!content) return;
  const { error } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
  });
  if (error) throw new Error(error.message);
}

export function subscribeMessages(conversationId: string, onInsert: (row: any) => void) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`,
    }, (payload) => onInsert(payload.new))
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}


