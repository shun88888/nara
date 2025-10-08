import { Tabs } from 'expo-router';
import { useAuthStore } from '../../../src/stores/auth';
import { Redirect } from 'expo-router';

export default function ProviderTabsLayout() {
  const { session, role } = useAuthStore();
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (role !== 'provider') return <Redirect href="/(onboarding)/role-select" />;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="today" options={{ title: '今日' }} />
      <Tabs.Screen name="slots" options={{ title: '枠' }} />
      <Tabs.Screen name="analytics" options={{ title: '分析' }} />
      <Tabs.Screen name="settings" options={{ title: '設定' }} />
    </Tabs>
  );
}


