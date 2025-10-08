import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="border-b border-[#E5E5E5] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">プライバシーポリシー</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-[#666] text-sm mb-6">最終更新日: 2025年1月8日</Text>

        {/* Introduction */}
        <View className="mb-6">
          <Text className="text-[#333] text-base leading-7">
            KIKKAKE（以下「当社」といいます。）は、お客様の個人情報の保護に最大限の注意を払い、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
          </Text>
        </View>

        {/* Section 1 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">1. 個人情報の収集</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            当社は、本サービスの提供にあたり、以下の個人情報を収集します。
          </Text>
          <View className="ml-3">
            <Text className="text-[#333] text-base leading-7 mb-2">
              ・氏名、メールアドレス、電話番号
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              ・住所、郵便番号
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              ・決済情報（クレジットカード情報等）
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              ・予約履歴、利用履歴
            </Text>
            <Text className="text-[#333] text-base leading-7">
              ・その他、サービス提供に必要な情報
            </Text>
          </View>
        </View>

        {/* Section 2 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">2. 個人情報の利用目的</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            当社は、収集した個人情報を以下の目的で利用します。
          </Text>
          <View className="ml-3">
            <Text className="text-[#333] text-base leading-7 mb-2">
              1. 本サービスの提供・運営のため
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              2. ユーザーからのお問い合わせへの対応のため
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              3. 予約の確認、変更、キャンセル等の連絡のため
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              4. サービスの品質向上、新サービス開発のため
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              5. メールマガジンや各種お知らせの配信のため
            </Text>
            <Text className="text-[#333] text-base leading-7">
              6. 規約違反行為への対応のため
            </Text>
          </View>
        </View>

        {/* Section 3 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">3. 個人情報の第三者提供</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供することはありません。
          </Text>
          <View className="ml-3">
            <Text className="text-[#333] text-base leading-7 mb-2">
              1. 予約した体験の提供者に必要な範囲で提供する場合
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              2. 法令に基づく場合
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              3. 人の生命、身体または財産の保護のために必要がある場合
            </Text>
            <Text className="text-[#333] text-base leading-7">
              4. 国の機関等への協力が必要な場合
            </Text>
          </View>
        </View>

        {/* Section 4 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">4. 個人情報の管理</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            当社は、お客様の個人情報を正確かつ最新の状態に保ち、不正アクセス、紛失、破損、改ざん、漏洩などを防止するため、適切な安全管理措置を講じます。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            また、個人情報の取り扱いを外部に委託する場合には、委託先に対して適切な監督を行います。
          </Text>
        </View>

        {/* Section 5 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">5. Cookieの使用</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            本サービスでは、サービスの品質向上およびユーザー体験の改善のため、Cookieを使用することがあります。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            Cookieの使用を希望されない場合は、ブラウザの設定でCookieを無効にすることができますが、一部のサービスが正常に機能しない場合があります。
          </Text>
        </View>

        {/* Section 6 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">6. 個人情報の開示・訂正・削除</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            お客様は、当社が保有する自己の個人情報について、開示、訂正、削除を請求することができます。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            請求を行う場合は、アプリ内の「ヘルプ・サポート」よりお問い合わせください。
          </Text>
        </View>

        {/* Section 7 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">7. お子様の個人情報</Text>
          <Text className="text-[#333] text-base leading-7">
            本サービスは、保護者の方が未成年のお子様のために利用することを想定しています。お子様の個人情報を登録される際は、保護者の方の同意のもと、必要最小限の情報のみをご提供ください。
          </Text>
        </View>

        {/* Section 8 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">8. プライバシーポリシーの変更</Text>
          <Text className="text-[#333] text-base leading-7">
            当社は、法令の改正や事業内容の変更等に伴い、本ポリシーを変更することがあります。変更後のプライバシーポリシーは、当社ウェブサイトまたはアプリ上に掲示した時点から効力を生じるものとします。
          </Text>
        </View>

        {/* Section 9 */}
        <View className="mb-8">
          <Text className="text-black text-lg font-bold mb-3">9. お問い合わせ窓口</Text>
          <Text className="text-[#333] text-base leading-7 mb-2">
            個人情報の取り扱いに関するお問い合わせは、以下までご連絡ください。
          </Text>
          <View className="bg-[#F8F8F8] rounded-xl p-4 mt-3">
            <Text className="text-black text-sm font-bold mb-2">KIKKAKE カスタマーサポート</Text>
            <Text className="text-[#666] text-sm mb-1">メール: privacy@kikkake.jp</Text>
            <Text className="text-[#666] text-sm">電話: 03-1234-5678</Text>
            <Text className="text-[#999] text-xs mt-2">受付時間: 平日 10:00 - 18:00</Text>
          </View>
        </View>

        {/* SSL Info */}
        <View className="bg-[#F0F8FF] rounded-xl p-4 mb-6">
          <View className="flex-row items-start">
            <Ionicons name="shield-checkmark" size={20} color="#007AFF" />
            <View className="flex-1 ml-3">
              <Text className="text-black text-sm font-bold mb-1">安全な通信</Text>
              <Text className="text-[#666] text-xs leading-5">
                当サービスは、SSL/TLS暗号化通信を採用し、お客様の個人情報を安全に保護しています。
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
