import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth';

export default function Index() {
  const { session, role } = useAuthStore();
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (!role) return <Redirect href="/(onboarding)/role-select" />;
  return <Redirect href={role === 'user' ? '/(user)/(tabs)/home' : '/(provider)/(tabs)/today'} />;
}


