import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProviderStore } from '../../../src/stores/provider';

export default function Slots() {
  const { slots, createSlot, updateSlot } = useProviderStore();
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="p-4">
        <TouchableOpacity className="bg-black rounded-md py-3" onPress={() => createSlot()}>
          <Text className="text-center text-white">スロットを追加</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={slots}
        keyExtractor={s => s.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="mb-3 border border-[#E5E5E5] rounded-lg p-4">
            <Text className="text-black mb-1">{new Date(item.startAt).toLocaleString()} - {new Date(item.endAt).toLocaleTimeString()}</Text>
            <Text className="text-[#666] mb-3">在庫 {item.available}/{item.capacity} ・ {item.visibility}</Text>
            <TouchableOpacity className="border border-[#E5E5E5] rounded-md py-2" onPress={() => updateSlot(item.id, { available: Math.max(0, item.available - 1) })}>
              <Text className="text-center text-black">在庫 -1</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}


