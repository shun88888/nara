import { Text, View } from 'react-native';

export function Badge({ label }: { label: string }) {
  return (
    <View className="px-2 py-1 rounded-md bg-[#F5F5F5]">
      <Text className="text-[#111] text-xs">{label}</Text>
    </View>
  );
}


