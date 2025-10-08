import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../src/stores/auth';
import { useBookingStore, type Booking } from '../../../src/stores/booking';
import { Ionicons } from '@expo/vector-icons';

export default function BookingHistory() {
  const { session } = useAuthStore();
  const { past, fetchPast, loading } = useBookingStore();
  const [selectedTab, setSelectedTab] = useState<'all' | 'completed' | 'canceled'>('all');

  useEffect(() => {
    if (session?.userId) {
      fetchPast(session.userId);
    }
  }, [session?.userId]);

  const filteredBookings = past.filter((booking) => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'completed') return booking.status === 'completed' || booking.status === 'checked_in';
    if (selectedTab === 'canceled') return booking.status === 'canceled';
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'completed':
        return { text: '完了', color: 'bg-[#4CAF50]' };
      case 'checked_in':
        return { text: 'チェックイン済み', color: 'bg-[#2196F3]' };
      case 'canceled':
        return { text: 'キャンセル', color: 'bg-[#999]' };
      default:
        return { text: '不明', color: 'bg-[#666]' };
    }
  };

  const renderBookingCard = (booking: Booking) => {
    const badge = getStatusBadge(booking.status);

    return (
      <TouchableOpacity
        key={booking.id}
        className="bg-white border border-[#E5E5E5] rounded-xl p-4 mb-3"
        onPress={() => router.push(`/(user)/history/${booking.id}`)}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {/* Status Badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View className={`${badge.color} px-3 py-1 rounded-full`}>
            <Text className="text-white text-xs font-medium">{badge.text}</Text>
          </View>
          <Text className="text-[#999] text-xs">
            {formatDate(booking.startAt)}
          </Text>
        </View>

        {/* Experience Title */}
        <Text className="text-black text-lg font-bold mb-2" numberOfLines={1}>
          {booking.experienceTitle}
        </Text>

        {/* Provider & Time */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text className="text-[#666] text-sm ml-2" numberOfLines={1}>
            {booking.providerName || '提供者情報なし'}
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text className="text-[#666] text-sm ml-2">
            {formatTime(booking.startAt)}〜
          </Text>
        </View>

        {/* Child Name */}
        {booking.childName && (
          <View className="flex-row items-center border-t border-[#F0F0F0] pt-3">
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text className="text-[#666] text-sm ml-2">
              参加者: {booking.childName}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-[#E5E5E5] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">予約履歴</Text>
          <View className="w-10" />
        </View>

        {/* Tabs */}
        <View className="flex-row mt-4 -mx-1">
          <TouchableOpacity
            className={`flex-1 mx-1 py-2 rounded-lg ${
              selectedTab === 'all' ? 'bg-black' : 'bg-[#F0F0F0]'
            }`}
            onPress={() => setSelectedTab('all')}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === 'all' ? 'text-white' : 'text-[#666]'
              }`}
            >
              すべて
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 mx-1 py-2 rounded-lg ${
              selectedTab === 'completed' ? 'bg-black' : 'bg-[#F0F0F0]'
            }`}
            onPress={() => setSelectedTab('completed')}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === 'completed' ? 'text-white' : 'text-[#666]'
              }`}
            >
              完了
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 mx-1 py-2 rounded-lg ${
              selectedTab === 'canceled' ? 'bg-black' : 'bg-[#F0F0F0]'
            }`}
            onPress={() => setSelectedTab('canceled')}
          >
            <Text
              className={`text-center font-medium ${
                selectedTab === 'canceled' ? 'text-white' : 'text-[#666]'
              }`}
            >
              キャンセル
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000" />
          <Text className="text-[#666] mt-4">読み込み中...</Text>
        </View>
      ) : filteredBookings.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="calendar-outline" size={64} color="#CCC" />
          <Text className="text-[#999] text-lg mt-4 text-center">
            {selectedTab === 'all' && '予約履歴がありません'}
            {selectedTab === 'completed' && '完了した予約がありません'}
            {selectedTab === 'canceled' && 'キャンセルした予約がありません'}
          </Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-4 py-4">
          {filteredBookings.map(renderBookingCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
