import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getSavedCards, setDefaultPaymentMethod, deletePaymentMethod, getOrCreateStripeCustomer, createEphemeralKey, createSetupIntent } from '../../../src/services/api/bookings';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

export default function PaymentMethods() {
  const [cards, setCards] = useState<{ id: string; brand: string | null; last4: string | null; exp_month: number | null; exp_year: number | null }[]>([]);
  const [defaultPmId, setDefaultPmId] = useState<string | null>(null);
  const [sheetReady, setSheetReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await getSavedCards();
      setCards(list.cards || []);
      setDefaultPmId(list.defaultPaymentMethodId || null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultPaymentMethod(id);
      setDefaultPmId(id);
    } catch (e: any) {
      Alert.alert('エラー', e.message || 'デフォルト設定に失敗しました');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('支払い方法を削除', '本当に削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除', style: 'destructive', onPress: async () => {
          try {
            await deletePaymentMethod(id);
            await refresh();
          } catch (e: any) {
            Alert.alert('エラー', e.message || '削除に失敗しました');
          }
        }
      }
    ]);
  };

  const handleAddCard = async () => {
    try {
      setOverlay(true);
      if (!sheetReady) {
        const { customerId } = await getOrCreateStripeCustomer();
        const { ephemeralKeySecret } = await createEphemeralKey();
        const { setupIntentClientSecret } = await createSetupIntent();
        const init = await initPaymentSheet({
          customerId,
          customerEphemeralKeySecret: ephemeralKeySecret,
          setupIntentClientSecret,
          merchantDisplayName: 'nara',
          returnURL: 'kikkake://stripe-redirect',
        });
        if (init.error) throw new Error(init.error.message);
        setSheetReady(true);
      }
      const res = await presentPaymentSheet();
      if (res.error && res.error.code !== 'Canceled') {
        Alert.alert('エラー', 'カード追加に失敗しました');
        return;
      }
      await refresh();
      Alert.alert('完了', 'カードを追加しました');
    } catch (e: any) {
      Alert.alert('エラー', e.message || 'カード追加に失敗しました');
    } finally {
      setOverlay(false);
    }
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
          {loading ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <ActivityIndicator size="large" color="#7B68EE" />
            </View>
          ) : cards.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center">
              <Ionicons name="card-outline" size={64} color="#CCC" />
              <Text className="text-[#999] text-base mt-4 text-center">
                登録されている支払い方法がありません
              </Text>
            </View>
          ) : (
            cards.map((method) => (
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
                      <Ionicons name={getCardIcon(method.brand || undefined)} size={24} color="#666" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-black text-base font-bold mb-1">
                        {(method.brand || '').toUpperCase()} •••• {method.last4}
                      </Text>
                      {defaultPmId === method.id && (
                        <View className="bg-[#007AFF] px-2 py-1 rounded-md self-start">
                          <Text className="text-white text-xs font-medium">デフォルト</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <View className="flex-row border-t border-[#F0F0F0] pt-3">
                  {defaultPmId !== method.id && (
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
                    className={defaultPmId === method.id ? 'flex-1' : 'flex-1 ml-2'}
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
            onPress={handleAddCard}
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
      {overlay && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <ActivityIndicator size="large" color="#7B68EE" />
        </View>
      )}
    </SafeAreaView>
  );
}
