import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type UserRole = Database['public']['Enums']['user_role'];

export interface AuthUser {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    throw new Error(error?.message || 'Authentication failed');
  }

  // Get user role from public.users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (userError) {
    throw new Error('Failed to fetch user role');
  }

  return {
    userId: data.user.id,
    email: data.user.email || email,
    role: userData.role,
  };
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  role: UserRole = 'user'
): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error(error?.message || 'Sign up failed');
  }

  // Update user role if needed (default is 'user' from trigger)
  if (role === 'provider') {
    const { error: updateError } = await supabase
      .from('users')
      .update({ role: 'provider' })
      .eq('id', data.user.id);

    if (updateError) {
      console.error('Failed to update user role:', updateError);
    }
  }

  return {
    userId: data.user.id,
    email: data.user.email || email,
    role,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Get current session
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session) {
    return null;
  }

  // Get user role
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (userError) {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email || '',
    role: userData.role,
  };
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message);
  }
}


