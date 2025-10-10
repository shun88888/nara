import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../../../src/stores/booking';
import { useExperienceStore } from '../../../src/stores/experience';
import { router, useLocalSearchParams } from 'expo-router';
import { normalizePhone } from '../../../src/lib/phone';
import { Ionicons } from '@expo/vector-icons';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';
import { createPaymentIntent, getOrCreateStripeCustomer, createEphemeralKey } from '../../../src/services/api/bookings';
import { useEffect, useState } from 'react';

export default function FinalConfirm() {
  const { experienceId, paymentMethod, bookingData } = useLocalSearchParams<{
    experienceId?: string;
    paymentMethod?: string;
    bookingData?: string;
  }>();

  const { confirmBooking } = useBookingStore();
  const { getExperienceById, getCachedExperienceById } = useExperienceStore();
  const experience = experienceId ? getCachedExperienceById(experienceId) : null;
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!experience && experienceId) {
      getExperienceById(experienceId);
    }
  }, [experienceId]);

  const data = bookingData ? JSON.parse(decodeURIComponent(bookingData)) : {};
  const { childName, age, guardianName, phone, coupon, notes } = data;

  const toIsoStartAt = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return new Date().toISOString();
    const t = (timeStr || '10:00').trim();
    const parts = t.split(':');
    const isoTime = parts.length >= 3 ? t : `${t}:00`;
    return `${dateStr}T${isoTime}Z`;
  };

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'credit':
        return 'クレジットカード';
      case 'onsite':
        return '現地払い';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-black text-2xl font-bold mb-6">最終確認</Text>

        {experience && (
          <View className="mb-6">
            <Text className="text-black text-lg font-bold mb-3">予約内容</Text>
            <View className="bg-[#F8F8F8] rounded-lg p-4">
              <View className="flex-row items-start mb-3 pb-3 border-b border-[#E5E5E5]">
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <View className="ml-3 flex-1">
                  <Text className="text-[#666] text-xs mb-1">体験名</Text>
                  <Text className="text-black text-base font-medium">{experience.title}</Text>
                </View>
              </View>
              <View className="flex-row items-start mb-3 pb-3 border-b border-[#E5E5E5]">
                <Ionicons name="time-outline" size={20} color="#666" />
                <View className="ml-3 flex-1">
                  <Text className="text-[#666] text-xs mb-1">所要時間</Text>
                  <Text className="text-black text-base">約{experience.durationMin}分</Text>
                </View>
              </View>
              <View className="flex-row items-start mb-3 pb-3 border-b border-[#E5E5E5]">
                <Ionicons name="location-outline" size={20} color="#666" />
                <View className="ml-3 flex-1">
                  <Text className="text-[#666] text-xs mb-1">開催場所</Text>
                  <Text className="text-black text-base">{experience.providerName}</Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <Ionicons name="cash-outline" size={20} color="#666" />
                <View className="ml-3 flex-1">
                  <Text className="text-[#666] text-xs mb-1">料金</Text>
                  <Text className="text-black text-xl font-bold">{experience?.priceYen !== undefined ? `¥${experience.priceYen.toLocaleString()}` : '¥-'}</Text>
                  <Text className="text-[#666] text-xs mt-1">材料費・保険料込み</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">参加者情報</Text>
          <View className="bg-[#F8F8F8] p-4 rounded-lg">
            <View className="mb-4 pb-4 border-b border-[#E5E5E5]">
              <Text className="text-[#666] text-xs mb-1">参加者</Text>
              <Text className="text-black text-lg font-medium">{childName}（{age}歳）</Text>
            </View>
            <View>
              <Text className="text-[#666] text-xs mb-1">保護者</Text>
              <Text className="text-black text-lg font-medium">{guardianName}</Text>
              <Text className="text-black text-base mt-1">{normalizePhone(phone)}</Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">支払い方法</Text>
          <View className="bg-[#F8F8F8] p-4 rounded-lg">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[#666] text-xs mb-1">選択済み</Text>
                <Text className="text-black text-base font-medium">{getPaymentMethodLabel(paymentMethod)}</Text>
              </View>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-[#7B68EE] text-sm font-medium">変更</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="rounded-lg py-4 bg-[#7B68EE] mb-3"
          onPress={async () => {
            try {
              if (!experienceId) return;
              setProcessing(true);
              const bookingParams: any = {
                experienceId,
                childName,
                childAge: Number(age),
                guardianName,
                guardianPhone: phone,
                startAt: toIsoStartAt(data.date, data.startTime),
                notes,
                couponCode: coupon || undefined,
              };

              if (paymentMethod === 'credit') {
                const { customerId } = await getOrCreateStripeCustomer();
                const { ephemeralKeySecret } = await createEphemeralKey();
                const { clientSecret, paymentIntentId } = await createPaymentIntent({ experienceId, couponCode: coupon || undefined, customerId });
                const init = await initPaymentSheet({
                  customerId,
                  customerEphemeralKeySecret: ephemeralKeySecret,
                  paymentIntentClientSecret: clientSecret,
                  merchantDisplayName: 'nara',
                  allowsDelayedPaymentMethods: false,
                  returnURL: 'kikkake://stripe-redirect',
                });
                if (init.error) { Alert.alert('エラー', '決済の初期化に失敗しました'); return; }
                const res = await presentPaymentSheet();
                if (res.error) { if (res.error.code !== 'Canceled') Alert.alert('エラー', '決済に失敗しました'); return; }
                const booking = await confirmBooking({ ...bookingParams, paymentMethod: 'credit', stripePaymentIntentId: paymentIntentId } as any);
                router.replace(`/(user)/qr/${booking.id}`);
                return;
              }

              const booking = await confirmBooking({ ...bookingParams, paymentMethod: 'onsite' } as any);
              router.replace(`/(user)/qr/${booking.id}`);
            } catch (e: any) {
              Alert.alert('エラー', e.message || '処理に失敗しました');
            } finally {
              setProcessing(false);
            }
          }}
        >
          <Text className="text-center text-white font-bold text-base">予約を確定する</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-lg py-4 border-2 border-[#E5E5E5]"
          onPress={() => router.push(`/(user)/booking/select-slot?experienceId=${experienceId}`)}
        >
          <Text className="text-center text-black font-medium">内容を修正する</Text>
        </TouchableOpacity>
      </ScrollView>
      {processing && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <ActivityIndicator size="large" color="#7B68EE" />
        </View>
      )}
    </SafeAreaView>
  );
}
