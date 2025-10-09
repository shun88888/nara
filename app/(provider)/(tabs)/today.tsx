import { View, Text, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProviderStore } from '../../../src/stores/provider';
import { useState, useRef } from 'react';
import { verifyToken } from '../../../src/lib/qr';

export default function ProviderToday() {
  const { today, checkIn } = useProviderStore();
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  const tokenInputRef = useRef<View>(null);

  const onVerify = () => {
    const res = verifyToken(token.trim());
    if (!res.ok || !res.payload) { setError(res.error || 'INVALID'); return; }
    checkIn(res.payload.booking_id);
    setToken('');
    setError('');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View className="p-4">
          <Text className="text-black mb-2">手動チェックイン（トークン）</Text>
          <View ref={tokenInputRef}>
            <TextInput
              value={token}
              onChangeText={setToken}
              placeholder="base64url.payload.signature"
              placeholderTextColor="#999"
              className="border border-[#E5E5E5] rounded-md px-4 py-3 mb-2 text-black"
            />
          </View>
          {error ? <Text className="text-[#d00] mb-2">{error}</Text> : null}
          <TouchableOpacity className="bg-black rounded-md py-3" onPress={onVerify}>
            <Text className="text-center text-white">検証してチェックイン</Text>
          </TouchableOpacity>
        </View>
        <FlatList
        data={today}
        keyExtractor={b => b.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="mb-3 border border-[#E5E5E5] rounded-lg p-4">
            <Text className="text-black font-medium mb-1">{item.childName}（{item.age}歳）</Text>
            <Text className="text-[#666] mb-3">{item.experienceTitle} ・ {new Date(item.startAt).toLocaleTimeString()}</Text>
            <TouchableOpacity
              className={`rounded-md py-2 ${item.status === 'checked_in' ? 'bg-[#EEE]' : 'bg-black'}`}
              onPress={() => checkIn(item.id)}
              disabled={item.status === 'checked_in'}
            >
              <Text className={`text-center ${item.status === 'checked_in' ? 'text-[#999]' : 'text-white'}`}>
                {item.status === 'checked_in' ? '済' : 'チェックイン'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => (
          <View className="items-center mt-20 px-6">
            <Text className="text-black text-center">本日の予約はありません</Text>
          </View>
        )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


