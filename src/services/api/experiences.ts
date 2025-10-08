import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Experience = Database['public']['Tables']['experiences']['Row'];
type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];

export interface ExperienceWithProviderName extends Experience {
  providerName: string;
}

/**
 * Fetch all published experiences
 */
export async function getExperiences(params?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ExperienceWithProviderName[]> {
  let query = supabase
    .from('experiences')
    .select(`
      *,
      providers(business_name)
    `)
    .eq('is_published', true);

  if (params?.category) {
    query = query.eq('category', params.category);
  }

  if (params?.minPrice !== undefined) {
    query = query.gte('price_yen', params.minPrice);
  }

  if (params?.maxPrice !== undefined) {
    query = query.lte('price_yen', params.maxPrice);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch experiences: ${error.message}`);
  }

  // Transform data to match expected format
  return (data || []).map((exp: any) => ({
    ...exp,
    providerName: exp.providers?.business_name || '',
  }));
}

/**
 * Fetch a single experience by ID
 */
export async function getExperienceById(id: string): Promise<ExperienceWithProviderName | null> {
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      providers(business_name, address, phone, email)
    `)
    .eq('id', id)
    .eq('is_published', true)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null;
    }
    throw new Error(`Failed to fetch experience: ${error.message}`);
  }

  return {
    ...data,
    providerName: (data as any).providers?.business_name || '',
  };
}

/**
 * Search experiences by title or description
 */
export async function searchExperiences(query: string): Promise<ExperienceWithProviderName[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select(`
      *,
      providers(business_name)
    `)
    .eq('is_published', true)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

  if (error) {
    throw new Error(`Failed to search experiences: ${error.message}`);
  }

  return (data || []).map((exp: any) => ({
    ...exp,
    providerName: exp.providers?.business_name || '',
  }));
}

/**
 * Get experiences by provider ID (for provider dashboard)
 */
export async function getProviderExperiences(providerId: string): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch provider experiences: ${error.message}`);
  }

  return data || [];
}

/**
 * Create a new experience (provider only)
 */
export async function createExperience(experience: ExperienceInsert): Promise<Experience> {
  const { data, error } = await supabase
    .from('experiences')
    .insert(experience)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create experience: ${error.message}`);
  }

  return data;
}

/**
 * Update an experience (provider only)
 */
export async function updateExperience(
  id: string,
  updates: Partial<ExperienceInsert>
): Promise<Experience> {
  const { data, error } = await supabase
    .from('experiences')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update experience: ${error.message}`);
  }

  return data;
}

/**
 * Delete an experience (provider only)
 */
export async function deleteExperience(id: string): Promise<void> {
  const { error } = await supabase.from('experiences').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete experience: ${error.message}`);
  }
}
