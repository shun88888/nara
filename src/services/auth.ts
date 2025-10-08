import { supabase } from '../lib/supabase';

export async function signInWithEmail(email: string, password: string): Promise<{ userId: string; email: string }> {
  const hasSupabase = !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  if (!hasSupabase) {
    return { userId: 'mock_' + Math.random().toString(36).slice(2), email };
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw new Error(error?.message || 'Auth failed');
  return { userId: data.user.id, email: data.user.email || email };
}

export async function signOut(): Promise<void> {
  const hasSupabase = !!(process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  if (!hasSupabase) return;
  await supabase.auth.signOut();
}


