import { View, Text, FlatList, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../../../src/stores/booking';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Reservations() {
  const { upcoming, past } = useBookingStore();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [step2, setStep2] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'upcoming' | 'past'>('upcoming');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return {
      date: `${month}月${day}日（${weekday}）`,
      time: `${hour}:${minute}`,
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: 'bg-[#E8F5E9]', text: 'text-[#4CAF50]', label: '予約確定' };
      case 'checked_in':
        return { bg: 'bg-[#E3F2FD]', text: 'text-[#2196F3]', label: '受付済み' };
      case 'canceled':
        return { bg: 'bg-[#FFEBEE]', text: 'text-[#F44336]', label: 'キャンセル' };
      default:
        return { bg: 'bg-[#F5F5F5]', text: 'text-[#666]', label: '保留中' };
    }
  };

  const renderUpcomingItem = ({ item }: { item: any }) => {
    const { date, time } = formatDate(item.startAt);
    const badge = getStatusBadge(item.status);

    return (
      <TouchableOpacity
        className="mb-3 bg-white rounded-xl p-4 border border-[#E5E5E5]"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
        onPress={() => router.push(`/(user)/qr/${item.id}`)}
      >
        {/* Status Badge */}
        <View className="flex-row items-center justify-between mb-3">
          <View className={`${badge.bg} px-3 py-1 rounded-full`}>
            <Text className={`${badge.text} text-xs font-medium`}>{badge.label}</Text>
          </View>
          <Text className="text-[#999] text-xs">予約ID: {item.id.slice(0, 8)}</Text>
        </View>

        {/* Title */}
        <Text className="text-black text-lg font-bold mb-2">{item.experienceTitle}</Text>

        {/* Date & Time */}
        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text className="text-[#666] text-sm ml-2">{date}</Text>
        </View>

        <View className="flex-row items-center mb-4">
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text className="text-[#666] text-sm ml-2">{time}〜</Text>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="flex-1 bg-[#7B68EE] rounded-lg py-3 flex-row items-center justify-center"
            onPress={() => router.push(`/(user)/qr/${item.id}`)}
          >
            <Ionicons name="qr-code-outline" size={18} color="#fff" />
            <Text className="text-white font-medium ml-2">QRコード</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 border-2 border-[#E5E5E5] rounded-lg py-3 flex-row items-center justify-center"
            onPress={() => {
              setConfirmId(item.id);
              setStep2(false);
            }}
          >
            <Ionicons name="close-circle-outline" size={18} color="#666" />
            <Text className="text-[#666] font-medium ml-2">キャンセル</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPastItem = ({ item }: { item: any }) => {
    const { date, time } = formatDate(item.startAt);
    const badge = getStatusBadge(item.status);

    return (
      <View className="mb-3 bg-[#F8F8F8] rounded-xl p-4 border border-[#E5E5E5]">
        {/* Status Badge */}
        <View className="flex-row items-center justify-between mb-2">
          <View className={`${badge.bg} px-3 py-1 rounded-full`}>
            <Text className={`${badge.text} text-xs font-medium`}>{badge.label}</Text>
          </View>
        </View>

        {/* Title */}
        <Text className="text-[#666] text-base font-medium mb-2">{item.experienceTitle}</Text>

        {/* Date & Time */}
        <View className="flex-row items-center mb-1">
          <Ionicons name="calendar-outline" size={14} color="#999" />
          <Text className="text-[#999] text-xs ml-2">{date}</Text>
        </View>

        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#999" />
          <Text className="text-[#999] text-xs ml-2">{time}〜</Text>
        </View>

        {/* Review Button */}
        {item.status === 'checked_in' && (
          <TouchableOpacity className="mt-3 border border-[#7B68EE] rounded-lg py-2">
            <Text className="text-center text-[#7B68EE] text-sm font-medium">レビューを書く</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="px-4 pt-2 pb-4">
        <Text className="text-3xl font-bold text-black mb-4">予約</Text>

        {/* Tabs */}
        <View className="flex-row bg-[#F8F8F8] rounded-lg p-1">
          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${selectedTab === 'upcoming' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedTab('upcoming')}
            style={
              selectedTab === 'upcoming'
                ? {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }
                : {}
            }
          >
            <Text
              className={`text-center font-semibold ${selectedTab === 'upcoming' ? 'text-black' : 'text-[#999]'}`}
            >
              これから（{upcoming.length}）
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`flex-1 py-2 rounded-md ${selectedTab === 'past' ? 'bg-white' : 'bg-transparent'}`}
            onPress={() => setSelectedTab('past')}
            style={
              selectedTab === 'past'
                ? {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 1,
                  }
                : {}
            }
          >
            <Text className={`text-center font-semibold ${selectedTab === 'past' ? 'text-black' : 'text-[#999]'}`}>
              過去（{past.length}）
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {selectedTab === 'upcoming' ? (
        <FlatList
          data={upcoming}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={renderUpcomingItem}
          ListEmptyComponent={() => (
            <View className="items-center mt-20 px-6">
              <View className="w-24 h-24 rounded-full bg-[#F8F8F8] items-center justify-center mb-4">
                <Ionicons name="calendar-outline" size={40} color="#CCC" />
              </View>
              <Text className="text-black text-lg font-medium mb-2">予約はまだありません</Text>
              <Text className="text-[#999] text-center mb-6">
                体験を予約すると、ここに表示されます
              </Text>
              <TouchableOpacity
                className="bg-[#7B68EE] px-6 py-3 rounded-lg"
                onPress={() => router.push('/(user)/(tabs)/home')}
              >
                <Text className="text-white font-bold">体験を探す</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={past}
          keyExtractor={(b) => b.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          renderItem={renderPastItem}
          ListEmptyComponent={() => (
            <View className="items-center mt-20 px-6">
              <View className="w-24 h-24 rounded-full bg-[#F8F8F8] items-center justify-center mb-4">
                <Ionicons name="time-outline" size={40} color="#CCC" />
              </View>
              <Text className="text-black text-lg font-medium mb-2">過去の予約はありません</Text>
              <Text className="text-[#999] text-center">
                参加した体験はここに表示されます
              </Text>
            </View>
          )}
        />
      )}

      {/* Cancel Modal */}
      <Modal visible={!!confirmId} transparent animationType="fade">
        <View className="flex-1 bg-[rgba(0,0,0,0.5)] items-center justify-center px-6">
          <View className="w-full bg-white rounded-2xl p-6">
            {!step2 ? (
              <>
                <View className="items-center mb-4">
                  <View className="w-16 h-16 rounded-full bg-[#FFF3E0] items-center justify-center mb-3">
                    <Ionicons name="alert-circle-outline" size={32} color="#FF9500" />
                  </View>
                  <Text className="text-black text-xl font-bold mb-2">予約をキャンセルしますか？</Text>
                  <Text className="text-[#666] text-center text-sm">
                    キャンセルポリシーに基づき、キャンセル料が発生する場合があります
                  </Text>
                </View>

                <View className="bg-[#FFF9E6] p-3 rounded-lg mb-4">
                  <Text className="text-[#666] text-xs mb-1">キャンセル料</Text>
                  <Text className="text-black text-sm">• 7日前まで: 無料</Text>
                  <Text className="text-black text-sm">• 3-6日前: 50%</Text>
                  <Text className="text-black text-sm">• 2日前-当日: 100%</Text>
                </View>

                <TouchableOpacity
                  className="bg-[#FF6B35] rounded-lg py-4 mb-3"
                  onPress={() => setStep2(true)}
                >
                  <Text className="text-center text-white font-bold text-base">キャンセル手続きへ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border-2 border-[#E5E5E5] rounded-lg py-4"
                  onPress={() => setConfirmId(null)}
                >
                  <Text className="text-center text-black font-medium">戻る</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="items-center mb-4">
                  <View className="w-16 h-16 rounded-full bg-[#FFEBEE] items-center justify-center mb-3">
                    <Ionicons name="warning-outline" size={32} color="#F44336" />
                  </View>
                  <Text className="text-black text-xl font-bold mb-2">最終確認</Text>
                  <Text className="text-[#666] text-center text-sm">
                    この操作は取り消すことができません。本当にキャンセルしますか？
                  </Text>
                </View>

                <TouchableOpacity
                  className="bg-[#F44336] rounded-lg py-4 mb-3"
                  onPress={() => setConfirmId(null)}
                >
                  <Text className="text-center text-white font-bold text-base">
                    キャンセルを確定する
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="border-2 border-[#E5E5E5] rounded-lg py-4"
                  onPress={() => {
                    setStep2(false);
                    setConfirmId(null);
                  }}
                >
                  <Text className="text-center text-black font-medium">やめる</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


