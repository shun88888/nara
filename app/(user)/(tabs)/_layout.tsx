import { Tabs } from 'expo-router';
import { useAuthStore } from '../../../src/stores/auth';
import { Redirect } from 'expo-router';
import { View, Text } from 'react-native';

export default function UserTabsLayout() {
  const { session, role } = useAuthStore();
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (role !== 'user') return <Redirect href="/(onboarding)/role-select" />;
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: 'ホーム' }} />
      <Tabs.Screen name="reservations" options={{ title: '予約' }} />
      <Tabs.Screen name="account" options={{ title: 'アカウント' }} />
    </Tabs>
  );
}


