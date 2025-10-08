import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../src/stores/auth';

export default function Account() {
  const { signout, role } = useAuthStore();
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 items-center justify-center px-6">
      <Text className="text-black text-lg mb-6">アカウント</Text>
      <Text className="text-[#666] mb-6">ロール: {role ?? '未設定'}</Text>
      <TouchableOpacity className="w-full bg-black rounded-md py-3" onPress={signout}>
        <Text className="text-center text-white font-medium">サインアウト</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


