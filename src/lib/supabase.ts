import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://wtmdugqriusycsapatbe.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0bWR1Z3FyaXVzeWNzYXBhdGJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NTAwODAsImV4cCI6MjA3NDMyNjA4MH0.A7FPsobquggJIKtv9uHqXRwkw1vbtQf4BJPp5IQE2JY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});


