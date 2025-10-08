import { View, Text, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useExperienceStore } from '../../../src/stores/experience';
import { router } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 36) / 2; // 2 columns with tighter padding

export default function Home() {
  const { experiences, fetchExperiences } = useExperienceStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'home' | 'recommended'>('home');

  useEffect(() => {
    fetchExperiences({ area: 'oimachi-line', onlyAvailable: true });
  }, []);

  const categories = ['すべて', 'アート', '料理', 'スポーツ', 'その他'];

  // Split experiences into two columns
  const leftColumn = experiences.filter((_, i) => i % 2 === 0);
  const rightColumn = experiences.filter((_, i) => i % 2 === 1);

  const renderCard = (item: any, index: number) => {
    const heights = [220, 260, 200, 280, 240]; // Varied heights for Pinterest effect
    const height = heights[index % heights.length];

    return (
      <TouchableOpacity
        key={item.id}
        className="mb-3 rounded-xl overflow-hidden"
        style={{
          width: CARD_WIDTH,
          height,
          backgroundColor: '#ffffff',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 5
        }}
        onPress={() => router.push(`/(user)/experience/${item.id}`)}
      >
        {/* Image - Takes up more space */}
        {item.photos && item.photos.length > 0 ? (
          <Image
            source={{ uri: item.photos[0] }}
            className="w-full"
            style={{ height: height * 0.7 }}
            resizeMode="cover"
          />
        ) : (
          <View
            className="bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] items-center justify-center w-full"
            style={{ height: height * 0.7 }}
          >
            <Text className="text-4xl">{['🎨', '🍳', '⚽', '🎭', '📚'][index % 5]}</Text>
          </View>
        )}

        {/* Minimal Content */}
        <View className="flex-1 px-2 py-2 justify-between">
          <Text className="text-black text-sm font-semibold mb-1 leading-tight" numberOfLines={2}>
            {item.title}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-[#999] text-xs">{item.providerName}</Text>
            <Text className="text-black text-sm font-bold">¥{item.priceYen.toLocaleString()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="px-4 pt-2 pb-2">
        <Text className="text-3xl font-bold text-black mb-4">きっかけを探す</Text>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row -mx-1"
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              className={`mx-1 px-4 py-2 rounded-full ${
                selectedCategory === cat || (selectedCategory === null && cat === 'すべて')
                  ? 'bg-black'
                  : 'bg-[#f0f0f0]'
              }`}
              onPress={() => setSelectedCategory(cat === 'すべて' ? null : cat)}
            >
              <Text
                className={`font-medium ${
                  selectedCategory === cat || (selectedCategory === null && cat === 'すべて')
                    ? 'text-white'
                    : 'text-[#666]'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pinterest-style Grid */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row px-3 pb-4 pt-2">
          {/* Left Column */}
          <View className="flex-1 pr-1.5">
            {leftColumn.map((item, index) => renderCard(item, index * 2))}
          </View>

          {/* Right Column */}
          <View className="flex-1 pl-1.5">
            {rightColumn.map((item, index) => renderCard(item, index * 2 + 1))}
          </View>
        </View>

        {experiences.length === 0 && (
          <View className="items-center py-20 px-6">
            <Text className="text-[#999] text-center text-lg">
              体験を読み込んでいます...
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
