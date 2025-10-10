import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMessageStore } from '../../../src/stores/message';

export default function Messages() {
  const { conversations, loading, fetchConversations } = useMessageStore();

  useEffect(() => {
    fetchConversations('user');
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨日';
    } else if (days < 7) {
      return `${days}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-[#E5E5E5]">
        <Text className="text-2xl font-bold text-black">メッセージ</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#7B68EE" />
        </View>
      ) : conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="chatbubbles-outline" size={80} color="#CCC" />
          <Text className="text-[#999] text-lg mt-4 text-center">
            メッセージはまだありません
          </Text>
          <Text className="text-[#999] text-sm mt-2 text-center">
            予約後、事業者とやり取りができます
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1">
          {conversations.map((conversation) => (
            <TouchableOpacity
              key={conversation.id}
              className="flex-row px-4 py-4 border-b border-[#E5E5E5] bg-white active:bg-[#F8F8F8]"
              onPress={() => router.push(`/(user)/messages/${conversation.id}`)}
            >
              {/* Provider Icon */}
              <View className="w-14 h-14 rounded-full bg-[#7B68EE] items-center justify-center mr-3">
                <Ionicons name="business" size={24} color="#FFF" />
              </View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-black text-base font-bold flex-1 mr-2" numberOfLines={1}>
                    {conversation.booking.experience.provider.business_name}
                  </Text>
                  {(conversation.last_message_at || conversation.lastMessage?.created_at) && (
                    <Text className="text-[#999] text-xs">
                      {formatDate(conversation.last_message_at || conversation.lastMessage!.created_at)}
                    </Text>
                  )}
                </View>

                <Text className="text-[#666] text-sm mb-1" numberOfLines={1}>
                  {conversation.booking.experience.title}
                </Text>

                <View className="flex-row items-center justify-between">
                  <Text
                    className={`flex-1 text-sm ${
                      conversation.unreadCount > 0 ? 'text-black font-medium' : 'text-[#999]'
                    }`}
                    numberOfLines={1}
                  >
                    {conversation.lastMessage?.content || 'メッセージを送信'}
                  </Text>

                  {conversation.unreadCount > 0 && (
                    <View className="ml-2 bg-[#FF3B30] rounded-full min-w-[20px] h-5 items-center justify-center px-1.5">
                      <Text className="text-white text-xs font-bold">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
