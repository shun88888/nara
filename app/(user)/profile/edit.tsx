import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../src/stores/auth';
import { Ionicons } from '@expo/vector-icons';

export default function EditProfile() {
  const { session, profile, updateProfile, loading } = useAuthStore();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');

  const scrollViewRef = useRef<ScrollView>(null);
  const lastNameRef = useRef<View>(null);
  const firstNameRef = useRef<View>(null);
  const phoneNumberRef = useRef<View>(null);
  const postalCodeRef = useRef<View>(null);
  const addressRef = useRef<View>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setPhoneNumber(profile.phone_number || '');
      setPostalCode(profile.postal_code || '');
      setAddress(profile.address || '');
    }
  }, [profile]);

  const scrollToInput = (ref: React.RefObject<View>) => {
    setTimeout(() => {
      ref.current?.measureLayout(
        scrollViewRef.current as any,
        (x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 50, animated: true });
        },
        () => {}
      );
    }, 100);
  };

  const handleSave = async () => {
    if (!session?.userId) return;

    try {
      await updateProfile(session.userId, {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        postal_code: postalCode,
        address: address,
      });
      Alert.alert('成功', 'プロフィールを更新しました', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'プロフィールの更新に失敗しました');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
        <TouchableOpacity onPress={() => router.back()} className="w-10">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">プロフィール編集</Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-4 py-6">
          {/* Profile Picture */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-[#F0F0F0] items-center justify-center mb-3">
              <Ionicons name="person" size={48} color="#666" />
            </View>
            <TouchableOpacity>
              <Text className="text-[#007AFF] text-sm font-medium">写真を変更</Text>
            </TouchableOpacity>
          </View>

          {/* Email (Read-only) */}
          <View className="mb-4">
            <Text className="text-[#666] text-sm mb-2">メールアドレス</Text>
            <View className="bg-[#F8F8F8] rounded-lg px-4 py-3">
              <Text className="text-[#999]">{session?.email}</Text>
            </View>
            <Text className="text-[#999] text-xs mt-1">メールアドレスは変更できません</Text>
          </View>

          {/* Name */}
          <View className="mb-4">
            <Text className="text-[#666] text-sm mb-2">姓</Text>
            <View ref={lastNameRef}>
              <TextInput
                className="border border-[#E5E5E5] rounded-lg px-4 py-3 text-black"
                placeholder="山田"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => scrollToInput(lastNameRef)}
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-[#666] text-sm mb-2">名</Text>
            <View ref={firstNameRef}>
              <TextInput
                className="border border-[#E5E5E5] rounded-lg px-4 py-3 text-black"
                placeholder="太郎"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                onFocus={() => scrollToInput(firstNameRef)}
              />
            </View>
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text className="text-[#666] text-sm mb-2">電話番号</Text>
            <View ref={phoneNumberRef}>
              <TextInput
                className="border border-[#E5E5E5] rounded-lg px-4 py-3 text-black"
                placeholder="090-1234-5678"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                onFocus={() => scrollToInput(phoneNumberRef)}
              />
            </View>
          </View>

          {/* Postal Code */}
          <View className="mb-4">
            <Text className="text-[#666] text-sm mb-2">郵便番号</Text>
            <View ref={postalCodeRef}>
              <TextInput
                className="border border-[#E5E5E5] rounded-lg px-4 py-3 text-black"
                placeholder="123-4567"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                value={postalCode}
                onChangeText={setPostalCode}
                onFocus={() => scrollToInput(postalCodeRef)}
              />
            </View>
          </View>

          {/* Address */}
          <View className="mb-6">
            <Text className="text-[#666] text-sm mb-2">住所</Text>
            <View ref={addressRef}>
              <TextInput
                className="border border-[#E5E5E5] rounded-lg px-4 py-3 text-black"
                placeholder="東京都品川区大井町1-2-3"
                placeholderTextColor="#999"
                value={address}
                onChangeText={setAddress}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                onFocus={() => scrollToInput(addressRef)}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            className="bg-black rounded-lg py-4"
            onPress={handleSave}
            disabled={loading}
          >
            <Text className="text-white text-center font-bold text-base">
              {loading ? '保存中...' : '保存する'}
            </Text>
          </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
