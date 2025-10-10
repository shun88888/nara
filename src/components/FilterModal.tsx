import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFilterStore } from '../stores/filter';
import { useState } from 'react';

type FilterModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
};

export function FilterModal({ visible, onClose, onApply }: FilterModalProps) {
  const {
    categories,
    minPrice,
    maxPrice,
    targetAges,
    durations,
    minRating,
    onlyAvailable,
    setCategories,
    setPriceRange,
    setTargetAges,
    setDurations,
    setMinRating,
    setOnlyAvailable,
    clearFilters,
  } = useFilterStore();

  // Local state for price range
  const [localMinPrice, setLocalMinPrice] = useState<number | null>(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState<number | null>(maxPrice);

  const categoryOptions = ['アート', '料理', 'スポーツ', 'その他'];
  const priceRanges = [
    { label: '¥0 - ¥3,000', min: 0, max: 3000 },
    { label: '¥3,000 - ¥5,000', min: 3000, max: 5000 },
    { label: '¥5,000 - ¥10,000', min: 5000, max: 10000 },
    { label: '¥10,000以上', min: 10000, max: null },
  ];
  const ageOptions = ['0-3歳', '3-6歳', '6-12歳', '12歳以上'];
  const durationOptions = ['30分以内', '30分-1時間', '1-2時間', '2時間以上'];

  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  const toggleAge = (age: string) => {
    if (targetAges.includes(age)) {
      setTargetAges(targetAges.filter((a) => a !== age));
    } else {
      setTargetAges([...targetAges, age]);
    }
  };

  const toggleDuration = (duration: string) => {
    if (durations.includes(duration)) {
      setDurations(durations.filter((d) => d !== duration));
    } else {
      setDurations([...durations, duration]);
    }
  };

  const selectPriceRange = (range: { min: number; max: number | null }) => {
    setPriceRange(range.min, range.max);
    setLocalMinPrice(range.min);
    setLocalMaxPrice(range.max);
  };

  const handleClear = () => {
    clearFilters();
    setLocalMinPrice(null);
    setLocalMaxPrice(null);
  };

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#E5E5E5]">
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">絞り込み</Text>
          <TouchableOpacity onPress={handleClear}>
            <Text className="text-[#007AFF] font-medium">クリア</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Category Section */}
          <View className="px-4 py-4 border-b border-[#E5E5E5]">
            <Text className="text-base font-bold text-black mb-3">カテゴリー</Text>
            <View className="flex-row flex-wrap">
              {categoryOptions.map((category) => {
                const isSelected = categories.includes(category);
                return (
                  <TouchableOpacity
                    key={category}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      isSelected ? 'bg-[#7B68EE]' : 'bg-[#F0F0F0]'
                    }`}
                    onPress={() => toggleCategory(category)}
                  >
                    <Text
                      className={`font-medium ${
                        isSelected ? 'text-white' : 'text-[#666]'
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Price Range Section */}
          <View className="px-4 py-4 border-b border-[#E5E5E5]">
            <Text className="text-base font-bold text-black mb-3">価格帯</Text>
            <View className="flex-row flex-wrap">
              {priceRanges.map((range, index) => {
                const isSelected = minPrice === range.min && maxPrice === range.max;
                return (
                  <TouchableOpacity
                    key={index}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      isSelected ? 'bg-[#7B68EE]' : 'bg-[#F0F0F0]'
                    }`}
                    onPress={() => selectPriceRange(range)}
                  >
                    <Text
                      className={`font-medium ${
                        isSelected ? 'text-white' : 'text-[#666]'
                      }`}
                    >
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Age Range Section */}
          <View className="px-4 py-4 border-b border-[#E5E5E5]">
            <Text className="text-base font-bold text-black mb-3">対象年齢</Text>
            <View className="flex-row flex-wrap">
              {ageOptions.map((age) => {
                const isSelected = targetAges.includes(age);
                return (
                  <TouchableOpacity
                    key={age}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      isSelected ? 'bg-[#7B68EE]' : 'bg-[#F0F0F0]'
                    }`}
                    onPress={() => toggleAge(age)}
                  >
                    <Text
                      className={`font-medium ${
                        isSelected ? 'text-white' : 'text-[#666]'
                      }`}
                    >
                      {age}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Duration Section */}
          <View className="px-4 py-4 border-b border-[#E5E5E5]">
            <Text className="text-base font-bold text-black mb-3">所要時間</Text>
            <View className="flex-row flex-wrap">
              {durationOptions.map((duration) => {
                const isSelected = durations.includes(duration);
                return (
                  <TouchableOpacity
                    key={duration}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      isSelected ? 'bg-[#7B68EE]' : 'bg-[#F0F0F0]'
                    }`}
                    onPress={() => toggleDuration(duration)}
                  >
                    <Text
                      className={`font-medium ${
                        isSelected ? 'text-white' : 'text-[#666]'
                      }`}
                    >
                      {duration}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Rating Section */}
          <View className="px-4 py-4 border-b border-[#E5E5E5]">
            <Text className="text-base font-bold text-black mb-3">口コミ評価</Text>
            <View className="flex-row flex-wrap">
              {[4.0, 4.5].map((rating) => {
                const isSelected = minRating === rating;
                return (
                  <TouchableOpacity
                    key={rating}
                    className={`mr-2 mb-2 px-4 py-2 rounded-full ${
                      isSelected ? 'bg-[#7B68EE]' : 'bg-[#F0F0F0]'
                    }`}
                    onPress={() => setMinRating(isSelected ? null : rating)}
                  >
                    <View className="flex-row items-center">
                      <Ionicons
                        name="star"
                        size={14}
                        color={isSelected ? '#FFF' : '#FF9500'}
                      />
                      <Text
                        className={`font-medium ml-1 ${
                          isSelected ? 'text-white' : 'text-[#666]'
                        }`}
                      >
                        {rating}以上
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Availability Section */}
          <View className="px-4 py-4">
            <TouchableOpacity
              className="flex-row items-center justify-between"
              onPress={() => setOnlyAvailable(!onlyAvailable)}
            >
              <View className="flex-row items-center">
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#666"
                  style={{ marginRight: 8 }}
                />
                <Text className="text-base text-black">残り枠がある体験のみ</Text>
              </View>
              <View
                className={`w-12 h-7 rounded-full ${
                  onlyAvailable ? 'bg-[#7B68EE]' : 'bg-[#E5E5E5]'
                } justify-center`}
              >
                <View
                  className={`w-5 h-5 rounded-full bg-white ${
                    onlyAvailable ? 'ml-6' : 'ml-1'
                  }`}
                />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="px-4 py-3 border-t border-[#E5E5E5]">
          <TouchableOpacity
            className="bg-[#7B68EE] py-4 rounded-lg"
            onPress={handleApply}
          >
            <Text className="text-center text-white font-bold text-base">
              この条件で絞り込む
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
