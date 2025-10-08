import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAnalyticsStore } from '../../../src/stores/analytics';

export default function Analytics() {
  const { nsmWeeklyCheckins } = useAnalyticsStore();
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 items-center justify-center">
      <Text className="text-black text-lg mb-2">体験完了数（週）</Text>
      <Text className="text-black text-3xl font-semibold">{nsmWeeklyCheckins}</Text>
      </View>
    </SafeAreaView>
  );
}


