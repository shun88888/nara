import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HelpSupport() {
  const handleContactSupport = () => {
    Alert.alert(
      'サポートに連絡',
      'メールアプリを開きますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '開く',
          onPress: () => {
            Linking.openURL('mailto:support@kikkake.jp?subject=お問い合わせ');
          },
        },
      ]
    );
  };

  const faqItems = [
    {
      category: '予約について',
      questions: [
        { q: '予約をキャンセルしたい', icon: 'calendar-outline' },
        { q: '予約内容を変更したい', icon: 'create-outline' },
        { q: '予約の確認方法は？', icon: 'checkmark-circle-outline' },
        { q: '複数名で予約できますか？', icon: 'people-outline' },
      ],
    },
    {
      category: '支払いについて',
      questions: [
        { q: '利用できる支払い方法は？', icon: 'card-outline' },
        { q: '領収書は発行できますか？', icon: 'receipt-outline' },
        { q: '返金について', icon: 'cash-outline' },
      ],
    },
    {
      category: 'アカウント',
      questions: [
        { q: 'パスワードを忘れた', icon: 'lock-closed-outline' },
        { q: 'メールアドレスを変更したい', icon: 'mail-outline' },
        { q: 'アカウントを削除したい', icon: 'trash-outline' },
      ],
    },
    {
      category: 'その他',
      questions: [
        { q: '体験当日について', icon: 'today-outline' },
        { q: 'お気に入りの使い方', icon: 'heart-outline' },
        { q: 'ポイントについて', icon: 'gift-outline' },
      ],
    },
  ];

  const contactMethods = [
    {
      icon: 'mail',
      title: 'メールでお問い合わせ',
      subtitle: 'support@kikkake.jp',
      color: '#007AFF',
      onPress: handleContactSupport,
    },
    {
      icon: 'chatbubbles',
      title: 'チャットサポート',
      subtitle: '平日 10:00 - 18:00',
      color: '#34C759',
      onPress: () => Alert.alert('チャットサポート', 'この機能は開発中です'),
    },
    {
      icon: 'call',
      title: '電話でお問い合わせ',
      subtitle: '03-1234-5678',
      color: '#FF9500',
      onPress: () => {
        Alert.alert(
          '電話をかける',
          '03-1234-5678に電話をかけますか？',
          [
            { text: 'キャンセル', style: 'cancel' },
            { text: '電話する', onPress: () => Linking.openURL('tel:0312345678') },
          ]
        );
      },
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8F8]" edges={['top']}>
      {/* Header */}
      <View className="bg-white border-b border-[#E5E5E5] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">ヘルプ・サポート</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Contact Methods */}
        <View className="px-4 py-4">
          <Text className="text-black text-lg font-bold mb-3">お問い合わせ</Text>
          {contactMethods.map((method, index) => (
            <TouchableOpacity
              key={index}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
              onPress={method.onPress}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${method.color}15` }}
              >
                <Ionicons name={method.icon as any} size={24} color={method.color} />
              </View>
              <View className="flex-1">
                <Text className="text-black text-base font-bold mb-1">{method.title}</Text>
                <Text className="text-[#666] text-sm">{method.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <View className="px-4 pb-4">
          <Text className="text-black text-lg font-bold mb-3">よくある質問</Text>

          {faqItems.map((category, catIndex) => (
            <View key={catIndex} className="mb-4">
              <Text className="text-[#666] text-sm font-medium mb-2">{category.category}</Text>
              <View className="bg-white rounded-xl overflow-hidden">
                {category.questions.map((item, qIndex) => (
                  <TouchableOpacity
                    key={qIndex}
                    className={`flex-row items-center justify-between px-4 py-4 ${
                      qIndex < category.questions.length - 1 ? 'border-b border-[#F0F0F0]' : ''
                    }`}
                    onPress={() => Alert.alert(item.q, 'この質問の詳細は準備中です')}
                  >
                    <View className="flex-row items-center flex-1">
                      <Ionicons name={item.icon as any} size={20} color="#666" />
                      <Text className="text-black text-sm ml-3 flex-1">{item.q}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#CCC" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Quick Links */}
        <View className="px-4 pb-4">
          <Text className="text-black text-lg font-bold mb-3">便利なリンク</Text>
          <View className="bg-white rounded-xl overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4 border-b border-[#F0F0F0]"
              onPress={() => router.push('/(user)/help/tutorial')}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="play-circle-outline" size={20} color="#666" />
                <Text className="text-black text-sm ml-3">チュートリアルを見る</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-between px-4 py-4"
              onPress={() => router.push('/(user)/help/feedback')}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="chatbox-outline" size={20} color="#666" />
                <Text className="text-black text-sm ml-3">フィードバックを送る</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#CCC" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency */}
        <View className="px-4 pb-8">
          <View className="bg-[#FFF0F5] rounded-xl p-4">
            <View className="flex-row items-start">
              <Ionicons name="warning" size={20} color="#FF3B30" />
              <View className="flex-1 ml-3">
                <Text className="text-black text-sm font-bold mb-1">緊急時のご連絡</Text>
                <Text className="text-[#666] text-xs leading-5 mb-2">
                  体験当日の緊急時は、予約確認メールに記載されている提供者の連絡先に直接お問い合わせください。
                </Text>
                <TouchableOpacity>
                  <Text className="text-[#FF3B30] text-xs font-medium">詳しく見る →</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
