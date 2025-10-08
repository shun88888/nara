import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type PaymentMethod = {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  isDefault: boolean;
};

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      isDefault: false,
    },
  ]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      '支払い方法を削除',
      '本当に削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(methods => methods.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'card';
      case 'mastercard':
        return 'card';
      case 'amex':
        return 'card';
      default:
        return 'card-outline';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-[#E5E5E5] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">支払い方法</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Payment Methods List */}
        <View className="px-4 py-4">
          {paymentMethods.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="card-outline" size={64} color="#CCC" />
              <Text className="text-[#999] text-base mt-4 text-center">
                登録されている支払い方法がありません
              </Text>
            </View>
          ) : (
            paymentMethods.map((method) => (
              <View
                key={method.id}
                className="bg-white rounded-xl p-4 mb-3"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <View className="w-12 h-12 rounded-lg bg-[#F0F0F0] items-center justify-center mr-3">
                      <Ionicons name={getCardIcon(method.brand)} size={24} color="#666" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-black text-base font-bold mb-1">
                        {method.brand} •••• {method.last4}
                      </Text>
                      {method.isDefault && (
                        <View className="bg-[#007AFF] px-2 py-1 rounded-md self-start">
                          <Text className="text-white text-xs font-medium">デフォルト</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row border-t border-[#F0F0F0] pt-3">
                  {!method.isDefault && (
                    <TouchableOpacity
                      className="flex-1 mr-2"
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <View className="border border-[#E5E5E5] rounded-lg py-2 items-center">
                        <Text className="text-black text-sm font-medium">デフォルトに設定</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    className={method.isDefault ? 'flex-1' : 'flex-1 ml-2'}
                    onPress={() => handleDelete(method.id)}
                  >
                    <View className="border border-[#FF3B30] rounded-lg py-2 items-center">
                      <Text className="text-[#FF3B30] text-sm font-medium">削除</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Info */}
        <View className="px-4 pb-4">
          <View className="bg-[#FFF9E6] rounded-xl p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#FF9500" />
              <View className="flex-1 ml-3">
                <Text className="text-black text-sm font-medium mb-1">
                  安全なお支払い
                </Text>
                <Text className="text-[#666] text-xs leading-5">
                  お客様のクレジットカード情報は暗号化され、安全に保護されます。当社がカード番号を直接保存することはありません。
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Payment Method Button */}
      <SafeAreaView edges={['bottom']} className="bg-white border-t border-[#E5E5E5]">
        <View className="px-4 py-3">
          <TouchableOpacity
            className="bg-black rounded-lg py-4"
            onPress={() => {
              Alert.alert('支払い方法を追加', 'この機能は開発中です');
            }}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="add" size={20} color="#fff" />
              <Text className="text-white text-base font-bold ml-2">
                支払い方法を追加
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
