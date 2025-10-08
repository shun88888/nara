import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../../../src/stores/booking';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { normalizePhone, isValidPhone } from '../../../src/lib/phone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = '@booking_info';

export default function BookingConfirm() {
  const { confirmBooking } = useBookingStore();
  const [childName, setChildName] = useState('');
  const [age, setAge] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [phone, setPhone] = useState('');
  const [coupon, setCoupon] = useState('');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(false);
  const [step, setStep] = useState<'input'|'confirm'>('input');
  const [saveInfo, setSaveInfo] = useState(false);

  // Load saved info on mount
  useEffect(() => {
    loadSavedInfo();
  }, []);

  const loadSavedInfo = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        setChildName(data.childName || '');
        setAge(data.age || '');
        setGuardianName(data.guardianName || '');
        setPhone(data.phone || '');
        setSaveInfo(true);
      }
    } catch (error) {
      console.error('Failed to load saved info:', error);
    }
  };

  const saveBookingInfo = async () => {
    try {
      const data = {
        childName,
        age,
        guardianName,
        phone,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save info:', error);
    }
  };

  const clearSavedInfo = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setSaveInfo(false);
    } catch (error) {
      console.error('Failed to clear saved info:', error);
    }
  };

  const handleNextStep = () => {
    if (saveInfo) {
      saveBookingInfo();
    } else {
      clearSavedInfo();
    }
    setStep('confirm');
  };

  const phoneOk = isValidPhone(phone);
  const ageOk = /^([3-9]|1[0-5])$/.test(age);
  const canNext = childName && ageOk && guardianName && phoneOk && terms;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <Text className="text-black text-2xl font-bold mb-6">{step === 'input' ? '予約情報の入力' : '最終確認'}</Text>

      {step === 'input' ? (
        <>
          {/* Participant Info */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="person-outline" size={20} color="#666" />
              <Text className="text-black text-lg font-bold ml-2">参加者情報</Text>
            </View>
            <View className="bg-[#F8F8F8] p-4 rounded-lg">
              <Text className="text-[#666] text-sm mb-2">お子様の氏名 *</Text>
              <TextInput
                placeholder="例: 山田 太郎"
                placeholderTextColor="#999"
                className="bg-white border border-[#E5E5E5] rounded-md px-4 py-3 mb-3 text-black"
                value={childName}
                onChangeText={setChildName}
              />
              <Text className="text-[#666] text-sm mb-2">年齢 *</Text>
              <TextInput
                placeholder="3〜15"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                className="bg-white border border-[#E5E5E5] rounded-md px-4 py-3 text-black"
                value={age}
                onChangeText={setAge}
              />
              {!ageOk && age.length > 0 && (
                <Text className="text-[#FF6B35] text-sm mt-1">3〜15歳の範囲で入力してください</Text>
              )}
            </View>
          </View>

          {/* Guardian Info */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
              <Text className="text-black text-lg font-bold ml-2">保護者情報</Text>
            </View>
            <View className="bg-[#F8F8F8] p-4 rounded-lg">
              <Text className="text-[#666] text-sm mb-2">保護者氏名 *</Text>
              <TextInput
                placeholder="例: 山田 花子"
                placeholderTextColor="#999"
                className="bg-white border border-[#E5E5E5] rounded-md px-4 py-3 mb-3 text-black"
                value={guardianName}
                onChangeText={setGuardianName}
              />
              <Text className="text-[#666] text-sm mb-2">電話番号 *</Text>
              <TextInput
                placeholder="例: 090-1234-5678"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                className="bg-white border border-[#E5E5E5] rounded-md px-4 py-3 text-black"
                value={phone}
                onChangeText={setPhone}
              />
              {!phoneOk && phone.length > 0 && (
                <Text className="text-[#FF6B35] text-sm mt-1">正しい電話番号を入力してください</Text>
              )}
            </View>
          </View>

          {/* Optional Info */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="information-circle-outline" size={20} color="#666" />
              <Text className="text-black text-lg font-bold ml-2">その他（任意）</Text>
            </View>
            <View className="bg-[#F8F8F8] p-4 rounded-lg">
              <Text className="text-[#666] text-sm mb-2">クーポンコード</Text>
              <TextInput
                placeholder="お持ちの方のみ入力"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                maxLength={12}
                className="bg-white border border-[#E5E5E5] rounded-md px-4 py-3 mb-3 text-black"
                value={coupon}
                onChangeText={setCoupon}
              />
              <Text className="text-[#666] text-sm mb-2">お伝えしたい情報</Text>
              <TextInput
                placeholder="アレルギーや特記事項がありましたらご記入ください（120字まで）"
                placeholderTextColor="#999"
                multiline
                maxLength={120}
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-white border border-[#E5E5E5] rounded-md px-4 py-3 text-black"
                style={{ minHeight: 80 }}
                value={notes}
                onChangeText={setNotes}
              />
              <Text className="text-[#999] text-xs mt-1 text-right">{notes.length}/120</Text>
            </View>
          </View>

          {/* Save Info Toggle */}
          <View className="flex-row items-center mb-4 bg-[#F0F8FF] p-3 rounded-lg">
            <Switch
              value={saveInfo}
              onValueChange={setSaveInfo}
              trackColor={{ false: '#E5E5E5', true: '#7B68EE' }}
              thumbColor={saveInfo ? '#fff' : '#f4f3f4'}
            />
            <View className="ml-3 flex-1">
              <Text className="text-black font-medium">次回のために情報を保存</Text>
              <Text className="text-[#666] text-xs mt-0.5">参加者・保護者情報を保存します</Text>
            </View>
          </View>

          {/* Terms */}
          <View className="flex-row items-start mb-6">
            <Switch
              value={terms}
              onValueChange={setTerms}
              trackColor={{ false: '#E5E5E5', true: '#7B68EE' }}
              thumbColor={terms ? '#fff' : '#f4f3f4'}
            />
            <View className="ml-3 flex-1">
              <Text className="text-black">
                <Text className="font-medium">利用規約</Text>と
                <Text className="font-medium">キャンセルポリシー</Text>に同意します
              </Text>
              <Text className="text-[#0066CC] text-sm mt-1">規約を確認する →</Text>
            </View>
          </View>

          <TouchableOpacity
            disabled={!canNext}
            className={`rounded-lg py-4 ${canNext ? 'bg-[#7B68EE]' : 'bg-[#E5E5E5]'}`}
            onPress={handleNextStep}
          >
            <Text className={`text-center ${canNext ? 'text-white' : 'text-[#999]'} font-bold text-base`}>確認画面へ進む</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View className="bg-[#F8F8F8] p-4 rounded-lg mb-6">
            <View className="mb-4 pb-4 border-b border-[#E5E5E5]">
              <Text className="text-[#666] text-sm mb-1">参加者</Text>
              <Text className="text-black text-lg font-medium">{childName}（{age}歳）</Text>
            </View>

            <View className="mb-4 pb-4 border-b border-[#E5E5E5]">
              <Text className="text-[#666] text-sm mb-1">保護者</Text>
              <Text className="text-black text-lg font-medium">{guardianName}</Text>
              <Text className="text-black text-base mt-1">{normalizePhone(phone)}</Text>
            </View>

            {coupon && (
              <View className="mb-4 pb-4 border-b border-[#E5E5E5]">
                <Text className="text-[#666] text-sm mb-1">クーポンコード</Text>
                <Text className="text-black text-base">{coupon}</Text>
              </View>
            )}

            {notes && (
              <View>
                <Text className="text-[#666] text-sm mb-1">お伝えしたい情報</Text>
                <Text className="text-black text-base leading-6">{notes}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            className="rounded-lg py-4 bg-[#7B68EE] mb-3"
            onPress={() => { const b = confirmBooking(); router.replace(`/(user)/qr/${b.id}`); }}
          >
            <Text className="text-center text-white font-bold text-base">予約を確定する</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-lg py-4 border-2 border-[#E5E5E5]"
            onPress={() => setStep('input')}
          >
            <Text className="text-center text-black font-medium">内容を修正する</Text>
          </TouchableOpacity>
        </>
      )}
      </ScrollView>
    </SafeAreaView>
  );
}


