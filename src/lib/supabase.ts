import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://nzkcktausubexsfoqloo.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56a2NrdGF1c3ViZXhzZm9xbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MTI4NzIsImV4cCI6MjA3NTQ4ODg3Mn0.SD95cPUKryizyIO3k_8V6RTwC9zMmUJLuRfwev9DSuA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});


