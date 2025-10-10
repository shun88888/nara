import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { useBookingStore } from '../../../src/stores/booking';
import { useExperienceStore } from '../../../src/stores/experience';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function QRScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { getBooking, refreshQrToken } = useBookingStore();
  const [booking, setBooking] = useState<any | null>(null);
  const { getExperienceById, getCachedExperienceById } = useExperienceStore();
  const [ttl, setTtl] = useState(600);
  useEffect(() => {
    (async () => {
      if (!bookingId) return;
      const b = await getBooking(bookingId);
      setBooking(b);
    })();
  }, [bookingId]);


  useEffect(() => {
    const timer = setInterval(() => setTtl(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!booking) return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-black">予約が見つかりません</Text>
    </SafeAreaView>
  );

  // Ensure experience title is available
  const exp = booking.experienceId ? getCachedExperienceById(booking.experienceId) : null;
  if (!exp && booking.experienceId) {
    getExperienceById(booking.experienceId);
  }

  const bookingDate = new Date(booking.startAt);
  const dateStr = `${bookingDate.getFullYear()}年${bookingDate.getMonth() + 1}月${bookingDate.getDate()}日`;
  const timeStr = `${bookingDate.getHours()}:${bookingDate.getMinutes().toString().padStart(2, '0')}`;
  const isExpiringSoon = ttl < 60;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-[#E5E5E5]">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="arrow-back" size={24} color="#000" />
          <Text className="text-lg font-bold text-black ml-2">予約確認</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1">
        {/* Success Message */}
        <View className="items-center py-6 px-4 bg-[#F0F8FF] border-b border-[#E5E5E5]">
          <View className="w-16 h-16 rounded-full bg-[#7B68EE] items-center justify-center mb-3">
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          <Text className="text-2xl font-bold text-black mb-2">予約が完了しました！</Text>
          <Text className="text-[#666] text-center">
            当日はこの画面のQRコードを受付でご提示ください
          </Text>
        </View>

        {/* Booking Details */}
        <View className="px-4 py-6 border-b border-[#E5E5E5]">
          <Text className="text-lg font-bold text-black mb-4">予約内容</Text>

          <View className="bg-[#F8F8F8] rounded-lg p-4">
            <View className="flex-row items-start mb-4">
              <Ionicons name="calendar-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-[#666] text-sm mb-1">体験名</Text>
                <Text className="text-black text-base font-medium">{booking.experienceTitle || exp?.title || ''}</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-4 pb-4 border-b border-[#E5E5E5]">
              <Ionicons name="time-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-[#666] text-sm mb-1">日時</Text>
                <Text className="text-black text-base font-medium">{dateStr}</Text>
                <Text className="text-black text-base font-medium">{timeStr}〜</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Ionicons name="location-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-[#666] text-sm mb-1">開催場所</Text>
                <Text className="text-black text-base font-medium">大井町ロボット教室</Text>
                <Text className="text-[#0066CC] text-sm mt-1">地図を見る →</Text>
              </View>
            </View>
          </View>
        </View>

        {/* QR Code */}
        <View className="px-4 py-6 items-center border-b border-[#E5E5E5]">
          <Text className="text-lg font-bold text-black mb-2">受付用QRコード</Text>
          <Text className="text-[#666] text-sm text-center mb-4">
            受付でこちらのQRコードをご提示ください
          </Text>

          <View className="bg-white p-6 rounded-2xl" style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 5
          }}>
            <QRCode value={booking.qrToken} size={220} />
          </View>

          {/* Timer */}
          <View className={`mt-4 px-4 py-2 rounded-lg ${isExpiringSoon ? 'bg-[#FFF3E0]' : 'bg-[#F8F8F8]'}`}>
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={18}
                color={isExpiringSoon ? '#FF9500' : '#666'}
              />
              <Text className={`ml-2 text-sm font-medium ${isExpiringSoon ? 'text-[#FF9500]' : 'text-[#666]'}`}>
                有効期限: {Math.floor(ttl / 60)}:{`${ttl % 60}`.padStart(2, '0')}
              </Text>
            </View>
          </View>

          {ttl === 0 && (
            <TouchableOpacity
              className="mt-4 bg-[#7B68EE] rounded-lg px-6 py-3"
              onPress={() => { refreshQrToken(booking.id); setTtl(600); }}
            >
              <Text className="text-white font-bold">QRコードを再発行</Text>
            </TouchableOpacity>
          )}

          <Text className="text-[#999] text-xs text-center mt-3">
            ※QRコードは10分ごとに更新されます
          </Text>
        </View>

        {/* Important Notes */}
        <View className="px-4 py-6 border-b border-[#E5E5E5]">
          <Text className="text-lg font-bold text-black mb-4">当日の注意事項</Text>

          <View className="bg-[#FFF9E6] p-4 rounded-lg">
            <View className="flex-row items-start mb-3">
              <Text className="text-base mr-2">•</Text>
              <Text className="text-black text-sm flex-1">
                開始時刻の10分前までに受付をお済ませください
              </Text>
            </View>
            <View className="flex-row items-start mb-3">
              <Text className="text-base mr-2">•</Text>
              <Text className="text-black text-sm flex-1">
                保護者様の送迎が必要です
              </Text>
            </View>
            <View className="flex-row items-start mb-3">
              <Text className="text-base mr-2">•</Text>
              <Text className="text-black text-sm flex-1">
                動きやすい服装でお越しください
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="text-base mr-2">•</Text>
              <Text className="text-black text-sm flex-1">
                遅刻される場合は必ずお電話ください
              </Text>
            </View>
          </View>
        </View>

        {/* Contact */}
        <View className="px-4 py-6">
          <Text className="text-lg font-bold text-black mb-4">お問い合わせ</Text>

          <TouchableOpacity className="flex-row items-center justify-between bg-[#F8F8F8] p-4 rounded-lg mb-3">
            <View className="flex-row items-center flex-1">
              <Ionicons name="call-outline" size={20} color="#666" />
              <View className="ml-3">
                <Text className="text-[#666] text-xs">電話でのお問い合わせ</Text>
                <Text className="text-black text-base font-medium">03-1234-5678</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center justify-between bg-[#F8F8F8] p-4 rounded-lg"
            onPress={async () => {
              try {
                const { getOrCreateConversation } = await import('../../../src/services/api/messages');
                const convId = await getOrCreateConversation(booking.id);
                router.push(`/(user)/messages/${convId}`);
              } catch (e) {
                console.warn(e);
              }
            }}
          >
            <View className="flex-row items-center flex-1">
              <Ionicons name="chatbubble-outline" size={20} color="#666" />
              <View className="ml-3">
                <Text className="text-[#666] text-xs">チャットでのお問い合わせ</Text>
                <Text className="text-black text-base font-medium">メッセージを送る</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="px-4 py-3 border-t border-[#E5E5E5]">
        <TouchableOpacity
          className="bg-white border-2 border-[#7B68EE] rounded-lg py-3"
          onPress={() => router.push('/(user)/(tabs)/reservations')}
        >
          <Text className="text-center text-[#7B68EE] font-bold">予約一覧に戻る</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


