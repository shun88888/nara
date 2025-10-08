import { View, Text, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const [autoplay, setAutoplay] = useState(true);

  const handleClearCache = () => {
    Alert.alert(
      'キャッシュをクリア',
      'アプリのキャッシュをクリアしますか？一時的に読み込みが遅くなる場合があります。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'クリア',
          style: 'destructive',
          onPress: () => {
            Alert.alert('完了', 'キャッシュをクリアしました');
          },
        },
      ]
    );
  };

  const handleResetSettings = () => {
    Alert.alert(
      '設定をリセット',
      'すべての設定を初期値に戻しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'リセット',
          style: 'destructive',
          onPress: () => {
            setDarkMode(false);
            setSaveData(false);
            setAutoplay(true);
            Alert.alert('完了', '設定をリセットしました');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-[#E5E5E5] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">設定</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Appearance */}
        <View className="px-4 py-4">
          <Text className="text-[#666] text-sm font-medium mb-3">表示</Text>

          <View className="bg-white rounded-xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">ダークモード</Text>
                <Text className="text-[#666] text-sm">
                  画面を暗い色調で表示します
                </Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
                disabled
              />
            </View>

            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1">
                <Text className="text-black text-base font-medium mb-1">テキストサイズ</Text>
                <Text className="text-[#666] text-sm">中</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data & Storage */}
        <View className="px-4 pb-4">
          <Text className="text-[#666] text-sm font-medium mb-3">データとストレージ</Text>

          <View className="bg-white rounded-xl overflow-hidden">
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">データ節約モード</Text>
                <Text className="text-[#666] text-sm">
                  画像の品質を下げてデータ使用量を削減
                </Text>
              </View>
              <Switch
                value={saveData}
                onValueChange={setSaveData}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1 mr-4">
                <Text className="text-black text-base font-medium mb-1">動画の自動再生</Text>
                <Text className="text-[#666] text-sm">
                  Wi-Fi接続時のみ自動再生
                </Text>
              </View>
              <Switch
                value={autoplay}
                onValueChange={setAutoplay}
                trackColor={{ false: '#E5E5E5', true: '#34C759' }}
                thumbColor="#fff"
              />
            </View>

            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4"
              onPress={handleClearCache}
            >
              <View className="flex-1">
                <Text className="text-black text-base font-medium mb-1">キャッシュをクリア</Text>
                <Text className="text-[#666] text-sm">約45.2 MB</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Privacy */}
        <View className="px-4 pb-4">
          <Text className="text-[#666] text-sm font-medium mb-3">プライバシー</Text>

          <View className="bg-white rounded-xl overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]"
              onPress={() => router.push('/(user)/settings/notifications')}
            >
              <View className="flex-1">
                <Text className="text-black text-base font-medium">通知設定</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
              <View className="flex-1">
                <Text className="text-black text-base font-medium">位置情報</Text>
                <Text className="text-[#666] text-sm">許可</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1">
                <Text className="text-black text-base font-medium">データの取り扱い</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Language */}
        <View className="px-4 pb-4">
          <Text className="text-[#666] text-sm font-medium mb-3">言語</Text>

          <View className="bg-white rounded-xl">
            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1">
                <Text className="text-black text-base font-medium">アプリの言語</Text>
                <Text className="text-[#666] text-sm">日本語</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Advanced */}
        <View className="px-4 pb-4">
          <Text className="text-[#666] text-sm font-medium mb-3">詳細設定</Text>

          <View className="bg-white rounded-xl overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]"
              onPress={handleResetSettings}
            >
              <View className="flex-1">
                <Text className="text-black text-base font-medium">設定をリセット</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-1">
                <Text className="text-black text-base font-medium">デバッグモード</Text>
                <Text className="text-[#666] text-sm">開発者向け</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* About */}
        <View className="px-4 pb-8">
          <View className="bg-white rounded-xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-[#666] text-sm">ストレージ使用量</Text>
              <Text className="text-black text-sm">127.5 MB</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-[#666] text-sm">データベースサイズ</Text>
              <Text className="text-black text-sm">8.2 MB</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#666] text-sm">最終同期</Text>
              <Text className="text-black text-sm">2分前</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
