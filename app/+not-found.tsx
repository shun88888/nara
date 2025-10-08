import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/stores/auth';

export default function NotFound() {
  const { role } = useAuthStore();
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-black text-lg mb-3">見つかりませんでした</Text>
      <TouchableOpacity className="border border-[#E5E5E5] rounded-md px-4 py-2" onPress={() => router.push(role === 'provider' ? '/(provider)/(tabs)/today' : '/(user)/(tabs)/home')}>
        <Text className="text-black">ホームへ</Text>
      </TouchableOpacity>
    </View>
  );
}


