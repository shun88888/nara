import { View, Text, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useExperienceStore, type Experience } from '../../../src/stores/experience';
import { useFavoriteStore } from '../../../src/stores/favorite';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function ExperienceDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getExperienceById, getCachedExperienceById } = useExperienceStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const [exp, setExp] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const isExpFavorite = exp ? isFavorite(exp.id) : false;

  const handleToggleFavorite = () => {
    if (!exp) return;

    if (isExpFavorite) {
      removeFavorite(exp.id);
    } else {
      addFavorite({
        id: exp.id,
        title: exp.title,
        providerName: exp.providerName,
        priceYen: exp.priceYen,
        photos: exp.photos,
        targetAge: exp.targetAge,
        area: exp.area,
        addedAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    async function loadExperience() {
      if (!id) {
        setLoading(false);
        return;
      }

      // Try to get from cache first
      const cached = getCachedExperienceById(id);
      if (cached) {
        setExp(cached);
        setLoading(false);
        return;
      }

      // Otherwise fetch from API
      setLoading(true);
      const data = await getExperienceById(id);
      setExp(data);
      setLoading(false);
    }

    loadExperience();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="text-black mt-4">読み込み中...</Text>
      </View>
    );
  }

  if (!exp) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-black mb-3">体験が見つかりません</Text>
        <TouchableOpacity className="border border-[#E5E5E5] px-4 py-2 rounded-md" onPress={() => router.back()}>
          <Text className="text-black">戻る</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={{ height: SCREEN_HEIGHT * 0.5 }}>
          {exp.photos && exp.photos.length > 0 ? (
            <Image
              source={{ uri: exp.photos[0] }}
              style={{ width: SCREEN_WIDTH, height: '100%' }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
              priority="high"
            />
          ) : (
            <View className="w-full h-full bg-[#f0f0f0] items-center justify-center">
              <Text className="text-6xl">🎨</Text>
            </View>
          )}

          {/* Top Navigation Icons */}
          <SafeAreaView className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4" edges={['top']}>
            <TouchableOpacity
              className="w-12 h-12 rounded-full bg-white items-center justify-center"
              onPress={() => router.back()}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <View className="flex-row">
              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-white items-center justify-center mr-2"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <Ionicons name="chatbubble-outline" size={22} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-white items-center justify-center mr-2"
                onPress={handleToggleFavorite}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <Ionicons
                  name={isExpFavorite ? "heart" : "heart-outline"}
                  size={22}
                  color={isExpFavorite ? "#FF6B9D" : "#000"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-white items-center justify-center mr-2"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <Ionicons name="time-outline" size={22} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                className="w-12 h-12 rounded-full bg-white items-center justify-center relative"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3
                }}
              >
                <Ionicons name="cart-outline" size={22} color="#000" />
                <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF6B35] items-center justify-center">
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Photo Gallery Button */}
          <View className="absolute bottom-4 right-4">
            <TouchableOpacity
              className="flex-row items-center bg-black/70 px-3 py-2 rounded-lg"
            >
              <Ionicons name="images-outline" size={18} color="#fff" />
              <Text className="text-white text-sm font-medium ml-2">フォトギャラリー</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-4 pb-24">
          {/* Title and Summary */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-2xl font-bold mb-2">{exp.title}</Text>
            <Text className="text-[#666] text-base leading-6">{exp.description}</Text>
          </View>

          {/* Rating and Stats */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <View className="flex-row items-center">
              <Ionicons name="star" size={20} color="#FF9500" />
              <Text className="text-black text-lg font-bold ml-1 mr-2">4.6</Text>
              <Text className="text-[#999] text-sm">(75件) • 1,000+ 予約実績</Text>
            </View>
          </View>

          {/* Key Info */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-lg font-bold mb-3">基本情報</Text>

            <View className="flex-row items-start mb-3">
              <Ionicons name="people-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-black font-medium">対象年齢</Text>
                <Text className="text-[#666]">{exp.targetAge}歳のお子様向け</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <Ionicons name="time-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-black font-medium">所要時間</Text>
                <Text className="text-[#666]">約{exp.durationMin}分</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <Ionicons name="location-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-black font-medium">開催場所</Text>
                <Text className="text-[#666]">{exp.providerName}</Text>
                <Text className="text-[#0066CC] text-sm mt-1">地図を見る →</Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <Ionicons name="person-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-black font-medium">保護者の付き添い</Text>
                <Text className="text-[#666]">送迎必須（体験中は不要）</Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <Ionicons name="cash-outline" size={20} color="#666" />
              <View className="ml-3 flex-1">
                <Text className="text-black font-medium">料金</Text>
                <Text className="text-black text-xl font-bold">¥{exp.priceYen.toLocaleString()}</Text>
                <Text className="text-[#666] text-sm">材料費・保険料込み</Text>
              </View>
            </View>
          </View>

          {/* What You'll Learn */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-lg font-bold mb-3">この体験で得られること</Text>
            <View className="flex-row flex-wrap mb-2">
              <View className="bg-[#f0f0f0] px-3 py-2 rounded-full mr-2 mb-2">
                <Text className="text-black text-sm">集中力</Text>
              </View>
              <View className="bg-[#f0f0f0] px-3 py-2 rounded-full mr-2 mb-2">
                <Text className="text-black text-sm">創造性</Text>
              </View>
              <View className="bg-[#f0f0f0] px-3 py-2 rounded-full mr-2 mb-2">
                <Text className="text-black text-sm">協調性</Text>
              </View>
            </View>
            <Text className="text-[#666] text-base leading-6">
              初心者の方でも安心してご参加いただけます。プロの講師が丁寧に指導し、お子様の成長をサポートします。
            </Text>
          </View>

          {/* What to Bring */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-lg font-bold mb-3">持ち物・服装</Text>
            <View className="mb-2">
              <Text className="text-black mb-1">• 動きやすい服装（汚れても良いもの）</Text>
              <Text className="text-black mb-1">• 飲み物</Text>
              <Text className="text-black mb-1">• タオル</Text>
            </View>
            <Text className="text-[#666] text-sm">※材料・道具は全てこちらでご用意します</Text>
          </View>

          {/* Schedule */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-lg font-bold mb-3">当日の流れ</Text>
            <View className="ml-2">
              <View className="flex-row mb-3">
                <Text className="text-[#666] w-16">10:00</Text>
                <Text className="text-black flex-1">集合・受付</Text>
              </View>
              <View className="flex-row mb-3">
                <Text className="text-[#666] w-16">10:15</Text>
                <Text className="text-black flex-1">オリエンテーション・説明</Text>
              </View>
              <View className="flex-row mb-3">
                <Text className="text-[#666] w-16">10:30</Text>
                <Text className="text-black flex-1">体験スタート</Text>
              </View>
              <View className="flex-row mb-3">
                <Text className="text-[#666] w-16">11:45</Text>
                <Text className="text-black flex-1">片付け・まとめ</Text>
              </View>
              <View className="flex-row">
                <Text className="text-[#666] w-16">12:00</Text>
                <Text className="text-black flex-1">解散</Text>
              </View>
            </View>
          </View>

          {/* Safety & Support */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-lg font-bold mb-3">安心・安全への取り組み</Text>
            <View className="mb-2">
              <Text className="text-black mb-1">• 傷害保険加入済み</Text>
              <Text className="text-black mb-1">• 保護者様の同伴可能</Text>
              <Text className="text-black mb-1">• アレルギー対応あり（事前にご相談ください）</Text>
              <Text className="text-black mb-1">• 写真撮影OK</Text>
            </View>
          </View>

          {/* Cancellation Policy */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-lg font-bold mb-3">キャンセルポリシー</Text>
            <View className="bg-[#FFF9E6] p-3 rounded-lg">
              <Text className="text-[#666] text-sm mb-1">• 7日前まで: 無料</Text>
              <Text className="text-[#666] text-sm mb-1">• 3-6日前: 50%</Text>
              <Text className="text-[#666] text-sm mb-1">• 2日前-当日: 100%</Text>
              <Text className="text-[#666] text-sm mt-2">※体調不良の場合はご相談ください</Text>
            </View>
          </View>

          {/* Provider Info */}
          <View className="py-4 border-b border-[#E5E5E5]">
            <Text className="text-black text-lg font-bold mb-3">教室について</Text>
            <View className="flex-row items-start">
              <View className="w-16 h-16 bg-[#f0f0f0] rounded-lg mr-3 items-center justify-center">
                <Ionicons name="business-outline" size={32} color="#666" />
              </View>
              <View className="flex-1">
                <Text className="text-black font-bold mb-1">{exp.providerName}</Text>
                <Text className="text-[#666] text-sm leading-5">
                  地域密着で10年以上の実績。お子様一人ひとりの個性を大切にした指導を心がけています。
                </Text>
              </View>
            </View>
          </View>

          {/* Classroom Features */}
          <View className="py-6">
            <Text className="text-black text-2xl font-bold mb-2 text-center">この教室の特徴</Text>
            <Text className="text-[#666] text-center mb-6">
              お子様の「好き」を「得意」に変える環境
            </Text>

            {/* Feature 1 */}
            <View className="mb-6">
              <View className="bg-[#F0F8FF] rounded-2xl overflow-hidden mb-3">
                <View className="w-full h-48 bg-[#E3F2FD] items-center justify-center">
                  <Ionicons name="people" size={60} color="#7B68EE" />
                </View>
              </View>
              <Text className="text-black text-xl font-bold mb-2">少人数制で手厚いサポート</Text>
              <Text className="text-[#666] leading-6 mb-2">
                1クラス最大6名の少人数制。講師の目が一人ひとりに行き届き、お子様のペースに合わせた丁寧な指導を実現しています。
              </Text>
              <View className="flex-row flex-wrap">
                <View className="bg-[#F0F8FF] px-3 py-1.5 rounded-full mr-2 mb-2">
                  <Text className="text-[#7B68EE] text-xs font-medium">最大6名</Text>
                </View>
                <View className="bg-[#F0F8FF] px-3 py-1.5 rounded-full mr-2 mb-2">
                  <Text className="text-[#7B68EE] text-xs font-medium">個別フォロー</Text>
                </View>
                <View className="bg-[#F0F8FF] px-3 py-1.5 rounded-full mb-2">
                  <Text className="text-[#7B68EE] text-xs font-medium">質問しやすい</Text>
                </View>
              </View>
            </View>

            {/* Feature 2 */}
            <View className="mb-6">
              <View className="bg-[#FFF9E6] rounded-2xl overflow-hidden mb-3">
                <View className="w-full h-48 bg-[#FFF3E0] items-center justify-center">
                  <Ionicons name="school" size={60} color="#FF9500" />
                </View>
              </View>
              <Text className="text-black text-xl font-bold mb-2">経験豊富な専門講師</Text>
              <Text className="text-[#666] leading-6 mb-3">
                業界歴10年以上のベテラン講師が在籍。子どもの発達段階に合わせた指導法で、楽しく学びながら確実にスキルアップ。
              </Text>
              <View className="bg-[#F8F8F8] p-3 rounded-lg">
                <View className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text className="text-black text-sm ml-2">資格保有講師が指導</Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text className="text-black text-sm ml-2">定期的な研修で指導力向上</Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text className="text-black text-sm ml-2">子どもとの接し方を熟知</Text>
                </View>
              </View>
            </View>

            {/* Feature 3 */}
            <View className="mb-6">
              <View className="bg-[#F0FFF4] rounded-2xl overflow-hidden mb-3">
                <View className="w-full h-48 bg-[#E8F5E9] items-center justify-center">
                  <Ionicons name="construct" size={60} color="#4CAF50" />
                </View>
              </View>
              <Text className="text-black text-xl font-bold mb-2">充実の設備と教材</Text>
              <Text className="text-[#666] leading-6 mb-2">
                最新の機材や教材を完備。安全性にも配慮した明るく清潔な教室で、お子様が集中して学べる環境を整えています。
              </Text>
              <View className="flex-row items-start mb-2">
                <Text className="text-base mr-2 text-[#4CAF50]">●</Text>
                <Text className="text-black text-sm flex-1">最新の教材・機材を常に導入</Text>
              </View>
              <View className="flex-row items-start mb-2">
                <Text className="text-base mr-2 text-[#4CAF50]">●</Text>
                <Text className="text-black text-sm flex-1">明るく広々とした専用スペース</Text>
              </View>
              <View className="flex-row items-start">
                <Text className="text-base mr-2 text-[#4CAF50]">●</Text>
                <Text className="text-black text-sm flex-1">安全対策を徹底した環境</Text>
              </View>
            </View>

            {/* Feature 4 */}
            <View className="mb-6">
              <View className="bg-[#FFF0F5] rounded-2xl overflow-hidden mb-3">
                <View className="w-full h-48 bg-[#FCE4EC] items-center justify-center">
                  <Ionicons name="heart" size={60} color="#FF6B9D" />
                </View>
              </View>
              <Text className="text-black text-xl font-bold mb-2">保護者との連携を大切に</Text>
              <Text className="text-[#666] leading-6 mb-3">
                毎回のレッスン後に進捗をお知らせ。定期的な面談で成長を共有し、ご家庭と一緒にお子様をサポートします。
              </Text>
              <View className="border-l-4 border-[#FF6B9D] pl-3 bg-[#FFF0F5] p-3 rounded-r-lg">
                <Text className="text-black text-sm italic">
                  「子どもの小さな成長も見逃さず報告してくれるので、親として安心して預けられます」
                </Text>
                <Text className="text-[#999] text-xs mt-2">- 保護者の声</Text>
              </View>
            </View>

            {/* Stats */}
            <View className="bg-gradient-to-b from-[#F8F8F8] to-white rounded-2xl p-4 mb-6">
              <Text className="text-black text-lg font-bold mb-4 text-center">実績</Text>
              <View className="flex-row flex-wrap justify-between">
                <View className="w-[48%] bg-white rounded-xl p-4 mb-3" style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                  <Text className="text-[#7B68EE] text-3xl font-bold mb-1">10年+</Text>
                  <Text className="text-[#666] text-sm">運営実績</Text>
                </View>

                <View className="w-[48%] bg-white rounded-xl p-4 mb-3" style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                  <Text className="text-[#FF9500] text-3xl font-bold mb-1">500名+</Text>
                  <Text className="text-[#666] text-sm">卒業生</Text>
                </View>

                <View className="w-[48%] bg-white rounded-xl p-4" style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                  <Text className="text-[#4CAF50] text-3xl font-bold mb-1">95%</Text>
                  <Text className="text-[#666] text-sm">満足度</Text>
                </View>

                <View className="w-[48%] bg-white rounded-xl p-4" style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                  <Text className="text-[#FF6B9D] text-3xl font-bold mb-1">4.8</Text>
                  <Text className="text-[#666] text-sm">平均評価</Text>
                </View>
              </View>
            </View>

            {/* CTA */}
            <View className="bg-[#7B68EE] rounded-2xl p-6 items-center">
              <Text className="text-white text-xl font-bold mb-2">まずは体験から</Text>
              <Text className="text-white/80 text-center mb-4">
                お子様に合うか、実際の雰囲気を{'\n'}体験レッスンで確かめてみませんか？
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="gift-outline" size={20} color="#fff" />
                <Text className="text-white font-medium ml-2">体験レッスン特別価格</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Fixed Bar */}
      <SafeAreaView
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#E5E5E5]"
        edges={['bottom']}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 5
        }}
      >
        <View className="px-4 py-3 flex-row items-center justify-between">
        <View>
          <Text className="text-black text-2xl font-bold">¥{exp.priceYen.toLocaleString()}</Text>
          <Text className="text-[#00A67E] text-xs">ポイント +55</Text>
        </View>

        <View className="flex-row">
          <TouchableOpacity
            className="bg-[#FF9500] px-6 py-3 rounded-lg mr-2"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
          >
            <Text className="text-white text-base font-bold">カートに追加</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-[#FF6B35] px-6 py-3 rounded-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3
            }}
            onPress={() => router.push(`/(user)/booking/select-slot?experienceId=${id}`)}
          >
            <Text className="text-white text-base font-bold">予約手続きへ</Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
