import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../src/stores/auth';
import { useBookingStore } from '../../../src/stores/booking';
import { Ionicons } from '@expo/vector-icons';

export default function Account() {
  const { signout } = useAuthStore();
  const { upcoming, past } = useBookingStore();

  const menuItems = [
    { icon: 'person-outline', title: 'プロフィール編集' },
    { icon: 'calendar-outline', title: '予約履歴' },
    { icon: 'heart-outline', title: 'お気に入り' },
    { icon: 'card-outline', title: '支払い方法' },
    { icon: 'notifications-outline', title: '通知設定' },
    { icon: 'help-circle-outline', title: 'ヘルプ・サポート' },
    { icon: 'document-text-outline', title: '利用規約' },
    { icon: 'shield-checkmark-outline', title: 'プライバシーポリシー' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 pt-2 pb-4">
          <Text className="text-3xl font-bold text-black">アカウント</Text>
        </View>

        {/* Profile Section */}
        <View className="px-4 mb-6">
          <View className="bg-[#F8F8F8] rounded-xl p-4">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-white border-2 border-[#E5E5E5] items-center justify-center mr-4">
                <Ionicons name="person" size={32} color="#666" />
              </View>
              <View className="flex-1">
                <Text className="text-black text-xl font-bold mb-1">山田 太郎</Text>
                <Text className="text-[#666] text-sm">test@example.com</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Stats */}
            <View className="flex-row border-t border-[#E5E5E5] pt-4">
              <View className="flex-1 items-center">
                <Text className="text-black text-2xl font-bold">{past.length}</Text>
                <Text className="text-[#666] text-xs mt-1">体験完了</Text>
              </View>
              <View className="flex-1 items-center border-l border-[#E5E5E5]">
                <Text className="text-black text-2xl font-bold">{upcoming.length}</Text>
                <Text className="text-[#666] text-xs mt-1">予約中</Text>
              </View>
              <View className="flex-1 items-center border-l border-[#E5E5E5]">
                <Text className="text-black text-2xl font-bold">0</Text>
                <Text className="text-[#666] text-xs mt-1">お気に入り</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View className="px-4 mb-6">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center justify-between py-4 border-b border-[#F0F0F0]"
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name={item.icon as any} size={22} color="#666" />
                <Text className="text-black text-base ml-3">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings Section */}
        <View className="px-4 mb-6">
          <Text className="text-[#666] text-sm font-medium mb-3">アプリ設定</Text>
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-[#F0F0F0]">
            <View className="flex-row items-center flex-1">
              <Ionicons name="settings-outline" size={22} color="#666" />
              <Text className="text-black text-base ml-3">設定</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View className="px-4 mb-6">
          <View className="bg-[#F8F8F8] rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-[#666] text-sm">アプリバージョン</Text>
              <Text className="text-black text-sm">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#666] text-sm">最終更新</Text>
              <Text className="text-black text-sm">2025年1月</Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <View className="px-4 pb-8">
          <TouchableOpacity
            className="border border-[#E5E5E5] rounded-xl py-4"
            onPress={signout}
          >
            <Text className="text-center text-[#666] font-medium">サインアウト</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


