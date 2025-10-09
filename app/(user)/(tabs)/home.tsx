import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { useExperienceStore } from '../../../src/stores/experience';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
    const heights = [280, 320, 260, 340, 300]; // Varied heights for Pinterest effect
    const height = heights[index % heights.length];

    // Generate random rating for demo
    const rating = (4.0 + Math.random() * 1.0).toFixed(1);
    const tags = item.category ? [item.category] : ['体験'];

    return (
      <TouchableOpacity
        key={item.id}
        className="mb-3 rounded-xl overflow-hidden"
        style={{
          width: CARD_WIDTH,
          backgroundColor: '#ffffff',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 6,
          borderWidth: 0.5,
          borderColor: '#E5E5E5',
        }}
        onPress={() => router.push(`/(user)/experience/${item.id}`)}
      >
        {/* Image with Tag Overlay */}
        <View style={{ position: 'relative' }}>
          {item.photos && item.photos.length > 0 ? (
            <Image
              source={{ uri: item.photos[0] }}
              className="w-full"
              style={{ height: height * 0.55 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              className="bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] items-center justify-center w-full"
              style={{ height: height * 0.55 }}
            >
              <Text className="text-4xl">{['🎨', '🍳', '⚽', '🎭', '📚'][index % 5]}</Text>
            </View>
          )}

          {/* Tag Overlay */}
          <View className="absolute top-2 left-2">
            <View className="bg-black/70 px-2 py-1 rounded-md">
              <Text className="text-white text-xs font-medium">{tags[0]}</Text>
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-2.5 py-2">
          {/* Title */}
          <Text className="text-black text-sm font-bold leading-tight" numberOfLines={2} style={{ marginBottom: 6 }}>
            {item.title}
          </Text>

          {/* Provider Info - TikTok style */}
          <View className="flex-row items-center" style={{ marginBottom: 3 }}>
            <View className="w-4 h-4 rounded-full bg-[#F0F0F0] items-center justify-center mr-1.5">
              <Ionicons name="business" size={10} color="#999" />
            </View>
            <Text className="text-[#666] text-xs flex-1" numberOfLines={1}>
              {item.providerName}
            </Text>
          </View>

          {/* Rating */}
          <View className="flex-row items-center" style={{ marginBottom: 3 }}>
            <Ionicons name="star" size={11} color="#FF9500" />
            <Text className="text-black text-xs font-medium ml-1 mr-1">{rating}</Text>
            <Text className="text-[#999] text-xs">(127)</Text>
          </View>

          {/* Price and Location */}
          <View className="flex-row items-center justify-between">
            <Text className="text-black text-sm font-bold">
              ¥{item.priceYen.toLocaleString()}
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="location" size={11} color="#999" />
              <Text className="text-[#999] text-xs ml-0.5">大井町</Text>
            </View>
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
