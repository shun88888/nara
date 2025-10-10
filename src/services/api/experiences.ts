import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Experience = Database['public']['Tables']['experiences']['Row'];
type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];

export interface ExperienceWithProviderName extends Experience {
  providerName: string;
}

/**
 * Fetch all published experiences with optional filters
 */
export async function getExperiences(params?: {
  categories?: string[];
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  targetAges?: string[];
  minDuration?: number;
  maxDuration?: number;
  minRating?: number;
  onlyAvailable?: boolean;
}): Promise<ExperienceWithProviderName[]> {
  let query = supabase
    .from('experiences')
    .select(`
      *,
      providers(business_name)
    `)
    .eq('is_published', true);

  // Category filter (support both single and multiple)
  if (params?.categories && params.categories.length > 0) {
    query = query.in('category', params.categories);
  } else if (params?.category) {
    query = query.eq('category', params.category);
  }

  // Price range filter
  if (params?.minPrice !== undefined) {
    query = query.gte('price_yen', params.minPrice);
  }

  if (params?.maxPrice !== undefined) {
    query = query.lte('price_yen', params.maxPrice);
  }

  // Duration filter
  if (params?.minDuration !== undefined) {
    query = query.gte('duration_min', params.minDuration);
  }

  if (params?.maxDuration !== undefined) {
    query = query.lte('duration_min', params.maxDuration);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch experiences: ${error.message}`);
  }

  let experiences = (data || []).map((exp: any) => ({
    ...exp,
    providerName: exp.providers?.business_name || '',
  }));

  // Client-side filtering for target ages (since it's stored as string)
  if (params?.targetAges && params.targetAges.length > 0) {
    const targetAges = params.targetAges;
    experiences = experiences.filter((exp) => {
      if (!exp.target_age) return false;
      // Check if any selected age range overlaps with the experience's target age
      return targetAges.some((age) => {
        // Simple matching - can be enhanced based on actual data format
        return exp.target_age.includes(age) ||
               exp.target_age.includes(age.replace('歳', '')) ||
               exp.target_age.includes(age.split('-')[0]);
      });
    });
  }

  // Filter by availability (check if has available time slots)
  if (params?.onlyAvailable) {
    const experienceIds = experiences.map((exp) => exp.id);

    const { data: slots } = await supabase
      .from('available_time_slots')
      .select('experience_id')
      .in('experience_id', experienceIds)
      .gte('date', new Date().toISOString().split('T')[0])
      .gt('remaining_capacity', 0);

    const availableIds = new Set((slots || []).map((slot: any) => slot.experience_id));
    experiences = experiences.filter((exp) => availableIds.has(exp.id));
  }

  return experiences;
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
