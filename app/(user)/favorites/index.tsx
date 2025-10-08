import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFavoriteStore } from '../../../src/stores/favorite';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = (SCREEN_WIDTH - 36) / 2;

export default function Favorites() {
  const { favorites, removeFavorite } = useFavoriteStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  };

  const renderCard = (item: any, index: number) => {
    const heights = [220, 260, 200, 280, 240];
    const height = heights[index % heights.length];

    return (
      <View
        key={item.id}
        className="mb-3 rounded-xl overflow-hidden"
        style={{
          width: CARD_WIDTH,
          backgroundColor: '#ffffff',
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <TouchableOpacity
          style={{ height }}
          onPress={() => router.push(`/(user)/experience/${item.id}`)}
        >
          {/* Image */}
          {item.photos && item.photos.length > 0 ? (
            <Image
              source={{ uri: item.photos[0] }}
              className="w-full"
              style={{ height: height * 0.7 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          ) : (
            <View
              className="bg-gradient-to-b from-[#f0f0f0] to-[#e0e0e0] items-center justify-center w-full"
              style={{ height: height * 0.7 }}
            >
              <Text className="text-4xl">{['🎨', '🍳', '⚽', '🎭', '📚'][index % 5]}</Text>
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity
            className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/90 items-center justify-center"
            onPress={(e) => {
              e.stopPropagation();
              removeFavorite(item.id);
            }}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Ionicons name="heart" size={20} color="#FF6B9D" />
          </TouchableOpacity>

          {/* Content */}
          <View className="flex-1 px-2 py-2 justify-between">
            <Text className="text-black text-sm font-semibold mb-1 leading-tight" numberOfLines={2}>
              {item.title}
            </Text>

            <View>
              <View className="flex-row items-center justify-between mb-1">
                <Text className="text-[#999] text-xs">{item.providerName}</Text>
                <Text className="text-black text-sm font-bold">¥{item.priceYen.toLocaleString()}</Text>
              </View>
              <Text className="text-[#999] text-xs">
                {formatDate(item.addedAt)}に追加
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Split into two columns
  const leftColumn = favorites.filter((_, i) => i % 2 === 0);
  const rightColumn = favorites.filter((_, i) => i % 2 === 1);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-[#E5E5E5]">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">お気に入り</Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Content */}
      {favorites.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={64} color="#CCC" />
          <Text className="text-[#999] text-lg mt-4 text-center">
            お気に入りがありません
          </Text>
          <Text className="text-[#CCC] text-sm mt-2 text-center">
            気になる体験をお気に入りに追加しましょう
          </Text>
          <TouchableOpacity
            className="bg-black rounded-lg px-6 py-3 mt-6"
            onPress={() => router.push('/(user)/(tabs)/home')}
          >
            <Text className="text-white font-medium">体験を探す</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Stats */}
          <View className="px-4 py-4 bg-[#F8F8F8]">
            <View className="flex-row items-center">
              <Ionicons name="heart" size={20} color="#FF6B9D" />
              <Text className="text-black text-base font-medium ml-2">
                {favorites.length}件のお気に入り
              </Text>
            </View>
          </View>

          {/* Pinterest-style Grid */}
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
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
