import '../global.css';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useAuthStore } from '../src/stores/auth';
import { useUIStore } from '../src/stores/ui';

export default function RootLayout() {
  const navRef = useNavigationContainerRef();
  const network = useUIStore(s => s.network);
  const session = useAuthStore(s => s.session);

  useEffect(() => {
    // future: analytics route change hook
  }, [navRef]);

  return (
    <SafeAreaProvider>
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'light'} />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}


