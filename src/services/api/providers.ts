import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Provider = Database['public']['Tables']['providers']['Row'];
type ProviderInsert = Database['public']['Tables']['providers']['Insert'];
type ProviderUpdate = Database['public']['Tables']['providers']['Update'];

/**
 * Get provider by user ID
 */
export async function getProviderByUserId(userId: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch provider: ${error.message}`);
  }

  return data;
}

/**
 * Get provider by ID
 */
export async function getProviderById(id: string): Promise<Provider | null> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch provider: ${error.message}`);
  }

  return data;
}

/**
 * Create provider profile
 */
export async function createProvider(provider: ProviderInsert): Promise<Provider> {
  const { data, error } = await supabase
    .from('providers')
    .insert(provider)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create provider: ${error.message}`);
  }

  return data;
}

/**
 * Update provider profile
 */
export async function updateProvider(id: string, updates: ProviderUpdate): Promise<Provider> {
  const { data, error } = await supabase
    .from('providers')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update provider: ${error.message}`);
  }

  return data;
}

/**
 * Get all active providers
 */
export async function getActiveProviders(): Promise<Provider[]> {
  const { data, error } = await supabase
    .from('providers')
    .select('*')
    .eq('is_active', true)
    .order('business_name', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch providers: ${error.message}`);
  }

  return data || [];
}
