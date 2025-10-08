import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth';

export default function RoleSelect() {
  const { session, role, setRole } = useAuthStore();
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (role === 'user') return <Redirect href="/(user)/(tabs)/home" />;
  if (role === 'provider') return <Redirect href="/(provider)/(tabs)/today" />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
      <Text className="text-2xl font-semibold text-black mb-6">あなたの役割を選択</Text>
      <TouchableOpacity className="w-full bg-black rounded-md py-3 mb-3" onPress={() => setRole('user')}>
        <Text className="text-center text-white font-medium">保護者としてはじめる</Text>
      </TouchableOpacity>
      <TouchableOpacity className="w-full border border-[#E5E5E5] rounded-md py-3" onPress={() => setRole('provider')}>
        <Text className="text-center text-black font-medium">事業者としてはじめる</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


