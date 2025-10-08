import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { session, loadSession, initialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!initialized) {
        await loadSession();
      }
      setIsLoading(false);
    }
    init();
  }, [initialized]);

  // Show loading while checking session
  if (isLoading || !initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // No session - go to sign in
  if (!session) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // Has session - redirect based on role
  if (session.role === 'provider') {
    return <Redirect href="/(provider)/(tabs)/today" />;
  }

  // Default to user home
  return <Redirect href="/(user)/(tabs)/home" />;
}


