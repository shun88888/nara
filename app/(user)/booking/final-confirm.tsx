import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../../../src/stores/booking';
import { useExperienceStore } from '../../../src/stores/experience';
import { router, useLocalSearchParams } from 'expo-router';
import { normalizePhone } from '../../../src/lib/phone';
import { Ionicons } from '@expo/vector-icons';

export default function FinalConfirm() {
  const { experienceId, paymentMethod, bookingData } = useLocalSearchParams<{
    experienceId?: string;
    paymentMethod?: string;
    bookingData?: string;
  }>();

  const { confirmBooking } = useBookingStore();
  const { getExperienceById } = useExperienceStore();
  const experience = experienceId ? getExperienceById(experienceId) : null;

  // Parse booking data from previous screen
  const data = bookingData ? JSON.parse(decodeURIComponent(bookingData)) : {};
  const { childName, age, guardianName, phone, coupon, notes } = data;

  const getPaymentMethodLabel = (method?: string) => {
    switch (method) {
      case 'credit':
        return 'クレジットカード';
      case 'konbini':
        return 'コンビニ払い';
      case 'bank':
        return '銀行振込';
      case 'paypay':
        return 'PayPay';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-black text-2xl font-bold mb-6">最終確認</Text>

        {/* Experience Summary */}
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
                  <Text className="text-black text-xl font-bold">¥{experience.priceYen.toLocaleString()}</Text>
                  <Text className="text-[#666] text-xs mt-1">材料費・保険料込み</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Participant Info */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">参加者情報</Text>
          <View className="bg-[#F8F8F8] p-4 rounded-lg">
            <View className="mb-4 pb-4 border-b border-[#E5E5E5]">
              <Text className="text-[#666] text-xs mb-1">参加者</Text>
              <Text className="text-black text-lg font-medium">{childName}（{age}歳）</Text>
            </View>

            <View className={`${coupon || notes ? 'mb-4 pb-4 border-b border-[#E5E5E5]' : ''}`}>
              <Text className="text-[#666] text-xs mb-1">保護者</Text>
              <Text className="text-black text-lg font-medium">{guardianName}</Text>
              <Text className="text-black text-base mt-1">{normalizePhone(phone)}</Text>
            </View>

            {coupon && (
              <View className={`${notes ? 'mb-4 pb-4 border-b border-[#E5E5E5]' : ''}`}>
                <Text className="text-[#666] text-xs mb-1">クーポンコード</Text>
                <Text className="text-black text-base font-medium">{coupon}</Text>
              </View>
            )}

            {notes && (
              <View>
                <Text className="text-[#666] text-xs mb-1">お伝えしたい情報</Text>
                <Text className="text-black text-base leading-6">{notes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment Method */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">支払い方法</Text>
          <View className="bg-[#F8F8F8] p-4 rounded-lg">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-[#666] text-xs mb-1">選択済み</Text>
                <Text className="text-black text-base font-medium">
                  {getPaymentMethodLabel(paymentMethod)}
                </Text>
                {paymentMethod === 'credit' && (
                  <Text className="text-[#666] text-sm mt-1">**** **** **** 1234</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-[#7B68EE] text-sm font-medium">変更</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Important Notice */}
        <View className="bg-[#FFF9E6] p-4 rounded-lg mb-6">
          <View className="flex-row items-start mb-2">
            <Ionicons name="information-circle" size={20} color="#FF9500" />
            <Text className="text-black font-bold ml-2">ご確認ください</Text>
          </View>
          <Text className="text-[#666] text-sm leading-5">
            予約確定後、登録されたメールアドレスに確認メールが送信されます。当日は受付でQRコードをご提示ください。
          </Text>
        </View>

        <TouchableOpacity
          className="rounded-lg py-4 bg-[#7B68EE] mb-3"
          onPress={() => {
            const b = confirmBooking(paymentMethod);
            router.replace(`/(user)/qr/${b.id}`);
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
    </SafeAreaView>
  );
}
