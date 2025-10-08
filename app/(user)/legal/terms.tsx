import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TermsOfService() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="border-b border-[#E5E5E5] px-4 py-3">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="w-10">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-black">利用規約</Text>
          <View className="w-10" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-[#666] text-sm mb-6">最終更新日: 2025年1月8日</Text>

        {/* Section 1 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第1条（適用）</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            本規約は、KIKKAKE（以下「当社」といいます。）が提供する体験予約サービス（以下「本サービス」といいます。）の利用に関する条件を、本サービスを利用するお客様（以下「ユーザー」といいます。）と当社との間で定めるものです。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。
          </Text>
        </View>

        {/* Section 2 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第2条（定義）</Text>
          <Text className="text-[#333] text-base leading-7 mb-2">
            本規約において使用する用語の定義は、以下のとおりとします。
          </Text>
          <View className="ml-3">
            <Text className="text-[#333] text-base leading-7 mb-2">
              1. 「体験」とは、本サービスを通じて提供される教育・娯楽プログラムを指します。
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              2. 「提供者」とは、体験を提供する事業者を指します。
            </Text>
            <Text className="text-[#333] text-base leading-7">
              3. 「予約」とは、ユーザーが本サービスを通じて体験の利用申込を行うことを指します。
            </Text>
          </View>
        </View>

        {/* Section 3 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第3条（ユーザー登録）</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            1. 本サービスの利用を希望する者は、本規約を遵守することに同意し、当社が定める方法により登録を申請することができます。
          </Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            2. 当社は、登録申請者が以下のいずれかに該当する場合、登録を拒否することがあります。
          </Text>
          <View className="ml-3">
            <Text className="text-[#333] text-base leading-7 mb-2">
              ・虚偽の情報を提供した場合
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              ・過去に本規約違反により登録を取り消された場合
            </Text>
            <Text className="text-[#333] text-base leading-7">
              ・その他、当社が不適切と判断した場合
            </Text>
          </View>
        </View>

        {/* Section 4 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第4条（予約と支払い）</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            1. ユーザーは、本サービスを通じて体験の予約を行い、所定の料金を支払うものとします。
          </Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            2. 予約の成立時期は、ユーザーが決済手続きを完了した時点とします。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            3. 支払われた料金は、本規約に定める場合を除き、返金されません。
          </Text>
        </View>

        {/* Section 5 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第5条（キャンセル）</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            1. ユーザーは、体験開始日の7日前までであれば、無料でキャンセルすることができます。
          </Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            2. 体験開始日の3〜6日前のキャンセルについては、料金の50%をキャンセル料としてお支払いいただきます。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            3. 体験開始日の2日前から当日のキャンセルについては、料金の100%をキャンセル料としてお支払いいただきます。
          </Text>
        </View>

        {/* Section 6 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第6条（禁止事項）</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            ユーザーは、本サービスの利用にあたり、以下の行為を行ってはならないものとします。
          </Text>
          <View className="ml-3">
            <Text className="text-[#333] text-base leading-7 mb-2">
              1. 法令または公序良俗に違反する行為
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              2. 犯罪行為に関連する行為
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              3. 当社や他のユーザー、提供者、第三者の権利を侵害する行為
            </Text>
            <Text className="text-[#333] text-base leading-7 mb-2">
              4. 本サービスの運営を妨害する行為
            </Text>
            <Text className="text-[#333] text-base leading-7">
              5. その他、当社が不適切と判断する行為
            </Text>
          </View>
        </View>

        {/* Section 7 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第7条（免責事項）</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            1. 当社は、本サービスに関して、システム障害、通信障害等により生じた損害について、一切の責任を負わないものとします。
          </Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            2. 体験の内容や品質については、提供者が責任を負うものとし、当社は一切の責任を負わないものとします。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            3. 当社は、本サービスの中断、停止、終了により生じた損害について、一切の責任を負わないものとします。
          </Text>
        </View>

        {/* Section 8 */}
        <View className="mb-6">
          <Text className="text-black text-lg font-bold mb-3">第8条（規約の変更）</Text>
          <Text className="text-[#333] text-base leading-7">
            当社は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の規約は、当社ウェブサイトに掲示された時点より効力を生じるものとします。
          </Text>
        </View>

        {/* Section 9 */}
        <View className="mb-8">
          <Text className="text-black text-lg font-bold mb-3">第9条（準拠法・管轄裁判所）</Text>
          <Text className="text-[#333] text-base leading-7 mb-3">
            1. 本規約の解釈にあたっては、日本法を準拠法とします。
          </Text>
          <Text className="text-[#333] text-base leading-7">
            2. 本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </Text>
        </View>

        {/* Contact */}
        <View className="bg-[#F8F8F8] rounded-xl p-4 mb-6">
          <Text className="text-black text-sm font-bold mb-2">お問い合わせ</Text>
          <Text className="text-[#666] text-sm leading-6">
            本規約に関するご質問は、アプリ内の「ヘルプ・サポート」よりお問い合わせください。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
