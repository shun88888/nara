import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { getOrCreateStripeCustomer, createEphemeralKey, createSetupIntent, hasSavedCard, getSavedCards, setDefaultPaymentMethod, deletePaymentMethod } from '../../../src/services/api/bookings';
import { initPaymentSheet, presentPaymentSheet } from '@stripe/stripe-react-native';

export default function Payment() {
  const { experienceId, bookingData } = useLocalSearchParams<{ experienceId?: string; bookingData?: string }>();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [sheetReady, setSheetReady] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasSavedCardState, setHasSavedCardState] = useState(false);
  const [cards, setCards] = useState<{ id: string; brand: string | null; last4: string | null; exp_month: number | null; exp_year: number | null }[]>([]);
  const [defaultPmId, setDefaultPmId] = useState<string | null>(null);
  const [selectedPmId, setSelectedPmId] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'credit', icon: 'card-outline', title: 'クレジットカード', description: 'Visa、Mastercard、JCB、AMEX', badge: '推奨' },
    { id: 'onsite', icon: 'cash-outline', title: '現地払い', description: '当日、現地でお支払いください', badge: null },
  ];

  useEffect(() => {
    // Prefetch saved cards immediately on mount (not only after selecting credit)
    (async () => {
      try {
        const list = await getSavedCards();
        const all = list.cards || [];
        const defaultId = list.defaultPaymentMethodId || null;
        const initialPick = defaultId || (all.length > 0 ? all[0].id : null);
        setCards(all);
        setDefaultPmId(defaultId);
        if (!selectedPmId) setSelectedPmId(initialPick);
        setHasSavedCardState(all.length > 0);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    // When credit is selected, we already have the list; pre-init PaymentSheet only
    if (selectedMethod !== 'credit') return;
    (async () => {
      try {
        const { customerId } = await getOrCreateStripeCustomer();
        const { ephemeralKeySecret } = await createEphemeralKey();
        const { setupIntentClientSecret } = await createSetupIntent();
        const init = await initPaymentSheet({
          customerId,
          customerEphemeralKeySecret: ephemeralKeySecret,
          setupIntentClientSecret,
          merchantDisplayName: 'nara',
          returnURL: 'kikkake://stripe-redirect',
          appearance: { primaryButton: { label: '支払う' } },
        });
        if (!init.error) setSheetReady(true);
      } catch {}
    })();
  }, [selectedMethod]);

  const handleSelectCard = async (pmId: string) => {
    setSelectedPmId(pmId);
    try {
      await setDefaultPaymentMethod(pmId); // 次回以降も使えるように保存
      setDefaultPmId(pmId);
    } catch (e: any) {
      Alert.alert('エラー', e.message || 'カードの選択に失敗しました');
    }
  };

  const handleDeleteCard = async (pmId: string) => {
    try {
      await deletePaymentMethod(pmId);
      setCards((prev) => prev.filter((c) => c.id !== pmId));
      if (selectedPmId === pmId) setSelectedPmId(null);
      if (defaultPmId === pmId) setDefaultPmId(null);
      const stillSaved = cards.length - 1 > 0;
      setHasSavedCardState(stillSaved);
    } catch (e: any) {
      Alert.alert('エラー', e.message || 'カードの削除に失敗しました');
    }
  };

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
        <Text className="text-[#666] text-sm mb-6">ご希望の支払い方法を選択してください</Text>

        {/* Payment Methods */}
        <View className="mb-6">
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                className={`bg-white rounded-xl p-4 mb-3 border-2 ${isSelected ? 'border-[#7B68EE]' : 'border-[#E5E5E5]'}`}
                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: isSelected ? 0.1 : 0.05, shadowRadius: 8, elevation: isSelected ? 3 : 1 }}
                onPress={() => setSelectedMethod(method.id)}
              >
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${isSelected ? 'bg-[#F0EBFF]' : 'bg-[#F8F8F8]'}`}>
                    <Ionicons name={method.icon as any} size={24} color={isSelected ? '#7B68EE' : '#666'} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className={`text-base font-bold ${isSelected ? 'text-black' : 'text-[#333]'}`}>{method.title}</Text>
                      {method.badge && (
                        <View className="ml-2 bg-[#7B68EE] px-2 py-0.5 rounded">
                          <Text className="text-white text-xs font-medium">{method.badge}</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-[#666] text-sm">{method.description}</Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-[#7B68EE] bg-[#7B68EE]' : 'border-[#CCC]'}`}>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                  </View>
                </View>

                {/* Saved cards list under credit */}
                {isSelected && method.id === 'credit' && (
                  <View className="mt-4 pt-4 border-t border-[#E5E5E5]">
                    {cards.length > 0 ? (
                      <>
                        <Text className="text-[#666] text-xs mb-2">保存済みのカード</Text>
                        {cards.map((c) => {
                          const picked = selectedPmId === c.id;
                          return (
                            <View key={c.id} className={`flex-row items-center p-3 mb-2 rounded-lg ${picked ? 'bg-[#F0EBFF]' : 'bg-[#F8F8F8]'}`}>
                              <Ionicons name="card" size={18} color="#666" />
                              <TouchableOpacity className="ml-3 flex-1" onPress={() => handleSelectCard(c.id)}>
                                <Text className="text-black">
                                  {(c.brand || '').toUpperCase()} **** {c.last4}  {c.exp_month}/{String(c.exp_year || '').slice(-2)}
                                </Text>
                                {defaultPmId === c.id && <Text className="text-[#666] text-xs mt-0.5">デフォルト</Text>}
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => handleDeleteCard(c.id)}>
                                <Text className="text-[#FF3B30] text-sm">削除</Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </>
                    ) : (
                      <Text className="text-[#666] text-sm">保存されたカードはありません</Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Card button when credit selected */}
        {selectedMethod === 'credit' && (
          <View className="mb-6">
            <TouchableOpacity
              className={`rounded-lg py-3 ${initializing ? 'bg-[#E5E5E5]' : 'bg-[#7B68EE]'}`}
              disabled={initializing}
              onPress={async () => {
                try {
                  if (!sheetReady) {
                    setShowOverlay(true);
                    setInitializing(true);
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
                  // refresh list
                  const list = await getSavedCards();
                  setCards(list.cards || []);
                  setDefaultPmId(list.defaultPaymentMethodId || null);
                  setSelectedPmId(list.defaultPaymentMethodId || null);
                  setHasSavedCardState((list.cards || []).length > 0);
                  Alert.alert('完了', 'カードを追加しました');
                } catch (e: any) {
                  Alert.alert('エラー', e.message || 'カード追加に失敗しました');
                } finally {
                  setInitializing(false);
                  setShowOverlay(false);
                }
              }}
            >
              <Text className={`text-center font-bold text-base ${initializing ? 'text-[#999]' : 'text-white'}`}>カードを追加</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action */}
      <View className="px-4 py-3 border-t border-[#E5E5E5]">
        <TouchableOpacity
          className={`rounded-lg py-4 ${selectedMethod && (selectedMethod === 'onsite' || selectedPmId || hasSavedCardState) ? 'bg-[#7B68EE]' : 'bg-[#E5E5E5]'}`}
          onPress={() => {
            if (!selectedMethod) return;
            if (selectedMethod === 'credit' && !(selectedPmId || hasSavedCardState)) return;
            router.push(
              `/(user)/booking/final-confirm?experienceId=${experienceId}&paymentMethod=${selectedMethod}&paymentMethodId=${selectedPmId || ''}&bookingData=${bookingData}`
            );
          }}
          disabled={!selectedMethod || (selectedMethod === 'credit' && !(selectedPmId || hasSavedCardState))}
        >
          <Text className={`text-center font-bold text-base ${selectedMethod && (selectedMethod === 'onsite' || selectedPmId || hasSavedCardState) ? 'text-white' : 'text-[#999]'}`}>最終確認へ進む</Text>
        </TouchableOpacity>
      </View>
      {showOverlay && (
        <View className="absolute inset-0 bg-black/20 items-center justify-center">
          <ActivityIndicator size="large" color="#7B68EE" />
        </View>
      )}
    </SafeAreaView>
  );
}
