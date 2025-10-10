import { View, Text, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState, useRef } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '../../../src/stores/message';
import { useAuthStore } from '../../../src/stores/auth';

export default function ProviderChat() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  const { session } = useAuthStore();
  const {
    currentMessages,
    loading,
    fetchMessages,
    sendNewMessage,
    markAsRead,
    subscribeToConversation,
    clearMessages,
  } = useMessageStore();

  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!conversationId) return;

    fetchMessages(conversationId);
    markAsRead(conversationId);

    // Subscribe to realtime updates
    const unsubscribe = subscribeToConversation(conversationId);

    return () => {
      if (unsubscribe) unsubscribe();
      clearMessages();
    };
  }, [conversationId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [currentMessages]);

  const handleSend = async () => {
    if (!messageText.trim() || !conversationId || sending) return;

    setSending(true);
    try {
      await sendNewMessage(conversationId, messageText.trim(), 'provider');
      setMessageText('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (senderId: string) => {
    return senderId === session?.userId;
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black flex-1 text-center">メッセージ</Text>
        <View className="w-6" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#7B68EE" />
          </View>
        ) : (
          <>
            {/* Messages */}
            <ScrollView
              ref={scrollViewRef}
              className="flex-1 px-4 py-3"
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {currentMessages.length === 0 ? (
                <View className="flex-1 items-center justify-center">
                  <Ionicons name="chatbubbles-outline" size={60} color="#CCC" />
                  <Text className="text-[#999] text-base mt-3">メッセージを送信してみましょう</Text>
                </View>
              ) : (
                currentMessages.map((message) => {
                  const isMine = isMyMessage(message.sender_id);
                  return (
                    <View
                      key={message.id}
                      className={`flex-row mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <View
                        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
                          isMine ? 'bg-[#7B68EE]' : 'bg-[#F0F0F0]'
                        }`}
                      >
                        <Text className={`text-base ${isMine ? 'text-white' : 'text-black'}`}>
                          {message.content}
                        </Text>
                        <Text
                          className={`text-xs mt-1 ${
                            isMine ? 'text-white/70' : 'text-[#999]'
                          }`}
                        >
                          {formatTime(message.created_at)}
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>

            {/* Input Area */}
            <View className="px-4 py-3 border-t border-[#E5E5E5]">
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 bg-[#F0F0F0] rounded-full px-4 py-3 text-base text-black mr-2"
                  placeholder="メッセージを入力..."
                  placeholderTextColor="#999"
                  value={messageText}
                  onChangeText={setMessageText}
                  multiline
                  maxLength={500}
                  editable={!sending}
                />
                <TouchableOpacity
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    messageText.trim() && !sending ? 'bg-[#7B68EE]' : 'bg-[#E5E5E5]'
                  }`}
                  onPress={handleSend}
                  disabled={!messageText.trim() || sending}
                >
                  {sending ? (
                    <ActivityIndicator size="small" color="#FFF" />
                  ) : (
                    <Ionicons
                      name="send"
                      size={20}
                      color={messageText.trim() ? '#FFF' : '#999'}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
