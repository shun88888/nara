import { supabase } from '../../lib/supabase';

export type SenderType = 'user' | 'provider';

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: SenderType;
  content: string;
  is_read: boolean;
  created_at: string;
};

export type Conversation = {
  id: string;
  booking_id: string;
  user_id: string;
  provider_id: string;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ConversationWithDetails = Conversation & {
  booking: {
    id: string;
    child_name: string;
    start_at: string;
    experience: {
      title: string;
      provider: {
        business_name: string;
      };
    };
  };
  lastMessage?: Message;
  unreadCount: number;
};

/**
 * Get or create a conversation for a booking
 */
export async function getOrCreateConversation(bookingId: string): Promise<string> {
  const { data, error } = await supabase.rpc('get_or_create_conversation', {
    p_booking_id: bookingId,
  });

  if (error) {
    throw new Error(`Failed to get/create conversation: ${error.message}`);
  }

  return data as string;
}

/**
 * Get all conversations for the current user
 */
export async function getUserConversations(): Promise<ConversationWithDetails[]> {
  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      booking:bookings (
        id,
        child_name,
        start_at,
        experience:experiences (
          title,
          provider:providers (
            business_name
          )
        )
      )
    `)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }

  // Fetch last message and unread count for each conversation
  const conversationsWithDetails = await Promise.all(
    (conversations || []).map(async (conv: any) => {
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('is_read', false)
        .neq('sender_id', (await supabase.auth.getUser()).data.user?.id);

      return {
        ...conv,
        lastMessage: lastMessage || undefined,
        unreadCount: unreadCount || 0,
      };
    })
  );

  return conversationsWithDetails;
}

/**
 * Get all conversations for the current provider
 */
export async function getProviderConversations(): Promise<ConversationWithDetails[]> {
  // First get provider_id for current user
  const { data: provider } = await supabase
    .from('providers')
    .select('id')
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (!provider) {
    return [];
  }

  const { data: conversations, error } = await supabase
    .from('conversations')
    .select(`
      *,
      booking:bookings (
        id,
        child_name,
        guardian_name,
        start_at,
        experience:experiences (
          title
        )
      )
    `)
    .eq('provider_id', provider.id)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }

  // Fetch last message and unread count for each conversation
  const conversationsWithDetails = await Promise.all(
    (conversations || []).map(async (conv: any) => {
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .eq('is_read', false)
        .neq('sender_id', (await supabase.auth.getUser()).data.user?.id);

      return {
        ...conv,
        lastMessage: lastMessage || undefined,
        unreadCount: unreadCount || 0,
      };
    })
  );

  return conversationsWithDetails;
}

/**
 * Get messages for a conversation
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return data || [];
}

/**
 * Send a message
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  senderType: SenderType
): Promise<Message> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      sender_type: senderType,
      content,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }

  return data;
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(conversationId: string): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', user.id)
    .eq('is_read', false);

  if (error) {
    throw new Error(`Failed to mark messages as read: ${error.message}`);
  }
}

/**
 * Subscribe to new messages in a conversation (realtime)
 */
export function subscribeToMessages(
  conversationId: string,
  onMessage: (message: Message) => void
) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onMessage(payload.new as Message);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
