import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '../../src/stores/auth';

export default function SignIn() {
  const { session, signin, error, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Simple redirect based on session
  // If session exists, redirect based on role
  if (session?.role === 'provider') {
    return <Redirect href="/(provider)/(tabs)/today" />;
  }

  if (session?.role === 'user') {
    return <Redirect href="/(user)/(tabs)/home" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
      <Text className="text-2xl font-semibold text-black mb-6">KIKKAKE</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#999"
        className="w-full border border-[#E5E5E5] rounded-md px-4 py-3 mb-3 text-black"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        className="w-full border border-[#E5E5E5] rounded-md px-4 py-3 mb-4 text-black"
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text className="text-[#d00] mb-2">{error}</Text> : null}
      <TouchableOpacity className="w-full bg-black rounded-md py-3" onPress={() => signin(email, password)}>
        <Text className="text-center text-white font-medium">Sign in</Text>
      </TouchableOpacity>

      <View className="w-full mt-4 border-t border-[#E5E5E5] pt-4">
        <Text className="text-center text-[#666] text-sm mb-3">開発用テストログイン</Text>

        {/* User test account */}
        <TouchableOpacity
          className="w-full bg-[#007AFF] rounded-md py-3 mb-2"
          onPress={() => {
            setEmail('user1@example.com');
            setPassword('password123');
          }}
        >
          <Text className="text-center text-white font-medium">👤 ユーザー1でログイン</Text>
        </TouchableOpacity>

        {/* Provider test accounts */}
        <View className="w-full mt-2 mb-2">
          <Text className="text-center text-[#999] text-xs mb-2">プロバイダー</Text>
        </View>
        <TouchableOpacity
          className="w-full bg-[#f5f5f5] rounded-md py-3 mb-2"
          onPress={() => {
            setEmail('provider1@example.com');
            setPassword('password123');
          }}
        >
          <Text className="text-center text-black font-medium">🏢 プロバイダー1でログイン</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="w-full bg-[#f5f5f5] rounded-md py-3"
          onPress={() => {
            setEmail('provider2@example.com');
            setPassword('password123');
          }}
        >
          <Text className="text-center text-black font-medium">🏢 プロバイダー2でログイン</Text>
        </TouchableOpacity>
      </View>
      </View>
    </SafeAreaView>
  );
}


