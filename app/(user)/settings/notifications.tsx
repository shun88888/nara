import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationSettings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [bookingReminders, setBookingReminders] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [newExperiences, setNewExperiences] = useState(true);
  const [reviewRequests, setReviewRequests] = useState(true);
  const [cancellations, setCancellations] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-[#E5E5E5] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">通知設定</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* General Notifications */}
        <View className="px-4 py-4">
          <Text className="text-[#666] text-sm font-medium mb-3">全般</Text>

          <View className="bg-white rounded-xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">プッシュ通知</Text>
                <Text className="text-[#666] text-sm">
                  重要なお知らせをプッシュ通知で受け取る
                </Text>
              </View>
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">メール通知</Text>
                <Text className="text-[#666] text-sm">
                  お知らせをメールで受け取る
                </Text>
              </View>
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Booking Notifications */}
        <View className="px-4 pb-4">
          <Text className="text-[#666] text-sm font-medium mb-3">予約関連</Text>

          <View className="bg-white rounded-xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">予約リマインダー</Text>
                <Text className="text-[#666] text-sm">
                  体験の1日前にリマインド通知を受け取る
                </Text>
              </View>
              <Switch
                value={bookingReminders}
                onValueChange={setBookingReminders}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">キャンセル通知</Text>
                <Text className="text-[#666] text-sm">
                  予約がキャンセルされた場合に通知を受け取る
                </Text>
              </View>
              <Switch
                value={cancellations}
                onValueChange={setCancellations}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">レビューリクエスト</Text>
                <Text className="text-[#666] text-sm">
                  体験後にレビュー依頼の通知を受け取る
                </Text>
              </View>
              <Switch
                value={reviewRequests}
                onValueChange={setReviewRequests}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Marketing */}
        <View className="px-4 pb-4">
          <Text className="text-[#666] text-sm font-medium mb-3">マーケティング</Text>

          <View className="bg-white rounded-xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">新着体験</Text>
                <Text className="text-[#666] text-sm">
                  おすすめの新しい体験情報を受け取る
                </Text>
              </View>
              <Switch
                value={newExperiences}
                onValueChange={setNewExperiences}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">キャンペーン情報</Text>
                <Text className="text-[#666] text-sm">
                  お得なキャンペーンやクーポン情報を受け取る
                </Text>
              </View>
              <Switch
                value={promotions}
                onValueChange={setPromotions}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Info */}
        <View className="px-4 pb-8">
          <View className="bg-[#F0F8FF] rounded-xl p-4">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={20} color="#007AFF" />
              <Text className="flex-1 text-[#666] text-xs ml-3 leading-5">
                重要な通知（予約確認、キャンセル、緊急のお知らせなど）は、設定に関わらず配信される場合があります。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
