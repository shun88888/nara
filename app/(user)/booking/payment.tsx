import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Payment() {
  const { experienceId, bookingData } = useLocalSearchParams<{ experienceId?: string; bookingData?: string }>();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'credit',
      icon: 'card-outline',
      title: 'クレジットカード',
      description: 'Visa、Mastercard、JCB、AMEX',
      badge: '推奨',
    },
    {
      id: 'konbini',
      icon: 'storefront-outline',
      title: 'コンビニ払い',
      description: 'セブンイレブン、ファミマ、ローソン',
      badge: null,
    },
    {
      id: 'bank',
      icon: 'business-outline',
      title: '銀行振込',
      description: '事前振込が必要です',
      badge: null,
    },
    {
      id: 'paypay',
      icon: 'logo-paypal',
      title: 'PayPay',
      description: 'PayPayアプリで支払い',
      badge: null,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">支払い方法の選択</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-black text-2xl font-bold mb-2">支払い方法を選択</Text>
        <Text className="text-[#666] text-sm mb-6">
          ご希望の支払い方法を選択してください
        </Text>

        {/* Payment Methods */}
        <View className="mb-6">
          {paymentMethods.map((method, index) => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                className={`bg-white rounded-xl p-4 mb-3 border-2 ${
                  isSelected ? 'border-[#7B68EE]' : 'border-[#E5E5E5]'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.1 : 0.05,
                  shadowRadius: 8,
                  elevation: isSelected ? 3 : 1,
                }}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                      isSelected ? 'bg-[#F0EBFF]' : 'bg-[#F8F8F8]'
                    }`}
                  >
                    <Ionicons
                      name={method.icon as any}
                      size={24}
                      color={isSelected ? '#7B68EE' : '#666'}
                    />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className={`text-base font-bold ${isSelected ? 'text-black' : 'text-[#333]'}`}>
                        {method.title}
                      </Text>
                      {method.badge && (
                        <View className="ml-2 bg-[#7B68EE] px-2 py-0.5 rounded">
                          <Text className="text-white text-xs font-medium">{method.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-[#666] text-sm">{method.description}</Text>
                  </View>

                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected ? 'border-[#7B68EE] bg-[#7B68EE]' : 'border-[#CCC]'
                    }`}
                  >
                    {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                </View>

                {/* Credit Card Details (shown when selected) */}
                {isSelected && method.id === 'credit' && (
                  <View className="mt-4 pt-4 border-t border-[#E5E5E5]">
                    <Text className="text-[#666] text-xs mb-2">登録済みのカード</Text>
                    <View className="bg-[#F8F8F8] rounded-lg p-3 mb-2">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="card" size={20} color="#666" />
                          <Text className="text-black ml-2">**** **** **** 1234</Text>
                        </View>
                        <Text className="text-[#666] text-sm">12/25</Text>
                      </View>
                    </View>
                    <TouchableOpacity className="flex-row items-center justify-center py-2">
                      <Ionicons name="add-circle-outline" size={18} color="#7B68EE" />
                      <Text className="text-[#7B68EE] ml-1 font-medium">新しいカードを追加</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Security Notice */}
        <View className="bg-[#F0F8FF] p-4 rounded-lg mb-6">
          <View className="flex-row items-start">
            <Ionicons name="shield-checkmark" size={20} color="#4A90E2" />
            <View className="ml-3 flex-1">
              <Text className="text-black font-bold mb-1">安全な決済</Text>
              <Text className="text-[#666] text-sm leading-5">
                お支払い情報は暗号化されて安全に処理されます。クレジットカード情報は当社のサーバーに保存されません。
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notes */}
        <View className="mb-6">
          <Text className="text-black font-bold mb-3">お支払いについて</Text>
          <View className="bg-[#F8F8F8] rounded-lg p-4">
            <View className="flex-row items-start mb-3">
              <Ionicons name="information-circle-outline" size={18} color="#666" />
              <Text className="text-[#666] text-sm ml-2 flex-1">
                クレジットカード払いの場合、予約確定時に決済が完了します
              </Text>
            </View>
            <View className="flex-row items-start mb-3">
              <Ionicons name="information-circle-outline" size={18} color="#666" />
              <Text className="text-[#666] text-sm ml-2 flex-1">
                コンビニ払いの場合、予約から24時間以内にお支払いください
              </Text>
            </View>
            <View className="flex-row items-start">
              <Ionicons name="information-circle-outline" size={18} color="#666" />
              <Text className="text-[#666] text-sm ml-2 flex-1">
                銀行振込の場合、入金確認後に予約が確定します
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View className="px-4 py-3 border-t border-[#E5E5E5]">
        <TouchableOpacity
          className={`rounded-lg py-4 ${selectedMethod ? 'bg-[#7B68EE]' : 'bg-[#E5E5E5]'}`}
          onPress={() =>
            selectedMethod &&
            router.push(
              `/(user)/booking/final-confirm?experienceId=${experienceId}&paymentMethod=${selectedMethod}&bookingData=${bookingData}`
            )
          }
          disabled={!selectedMethod}
        >
          <Text className={`text-center font-bold text-base ${selectedMethod ? 'text-white' : 'text-[#999]'}`}>
            最終確認へ進む
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
