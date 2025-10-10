import { create } from 'zustand';
import {
  getUserConversations,
  getProviderConversations,
  getMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
  type ConversationWithDetails,
  type Message,
  type SenderType,
} from '../services/api/messages';

type MessageState = {
  conversations: ConversationWithDetails[];
  currentMessages: Message[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchConversations: (role: 'user' | 'provider') => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendNewMessage: (conversationId: string, content: string, senderType: SenderType) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  subscribeToConversation: (conversationId: string) => (() => void) | null;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const useMessageStore = create<MessageState>((set, get) => ({
  conversations: [],
  currentMessages: [],
  loading: false,
  error: null,

  fetchConversations: async (role) => {
    set({ loading: true, error: null });
    try {
      const conversations = role === 'user'
        ? await getUserConversations()
        : await getProviderConversations();
      set({ conversations, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
      set({ error: error.message, loading: false });
    }
  },

  fetchMessages: async (conversationId) => {
    set({ loading: true, error: null });
    try {
      const messages = await getMessages(conversationId);
      set({ currentMessages: messages, loading: false });
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
      set({ error: error.message, loading: false });
    }
  },

  sendNewMessage: async (conversationId, content, senderType) => {
    try {
      const message = await sendMessage(conversationId, content, senderType);
      set((state) => ({
        currentMessages: [...state.currentMessages, message],
      }));
    } catch (error: any) {
      console.error('Failed to send message:', error);
      set({ error: error.message });
      throw error;
    }
  },

  markAsRead: async (conversationId) => {
    try {
      await markMessagesAsRead(conversationId);
      // Update local state to mark messages as read
      set((state) => ({
        currentMessages: state.currentMessages.map((msg) =>
          msg.conversation_id === conversationId ? { ...msg, is_read: true } : msg
        ),
      }));
    } catch (error: any) {
      console.error('Failed to mark messages as read:', error);
    }
  },

  subscribeToConversation: (conversationId) => {
    try {
      return subscribeToMessages(conversationId, (message) => {
        get().addMessage(message);
      });
    } catch (error: any) {
      console.error('Failed to subscribe to conversation:', error);
      return null;
    }
  },

  addMessage: (message) => {
    set((state) => {
      // Check if message already exists
      const exists = state.currentMessages.some((msg) => msg.id === message.id);
      if (exists) return state;

      return {
        currentMessages: [...state.currentMessages, message],
      };
    });
  },

  clearMessages: () => {
    set({ currentMessages: [] });
  },
}));
