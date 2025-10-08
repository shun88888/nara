import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/database.types';

type Booking = Database['public']['Tables']['bookings']['Row'];
type BookingInsert = Database['public']['Tables']['bookings']['Insert'];

export interface BookingWithExperience extends Booking {
  experienceTitle: string;
  providerName: string;
}

export interface CreateBookingParams {
  experienceId: string;
  childName: string;
  childAge: number;
  guardianName: string;
  guardianPhone: string;
  startAt: string;
  paymentMethod?: string;
  notes?: string;
  couponCode?: string;
}

/**
 * Create a new booking using Edge Function
 */
export async function createBooking(params: CreateBookingParams): Promise<Booking> {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw new Error('Not authenticated');
  }

  // Call Edge Function
  const { data, error } = await supabase.functions.invoke('confirm-booking', {
    body: params,
  });

  if (error) {
    throw new Error(`Failed to create booking: ${error.message}`);
  }

  return data.booking;
}

/**
 * Get user's bookings
 */
export async function getUserBookings(userId: string): Promise<BookingWithExperience[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      experiences(
        title,
        providers(business_name)
      )
    `)
    .eq('user_id', userId)
    .order('start_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch bookings: ${error.message}`);
  }

  // Transform data
  return (data || []).map((booking: any) => ({
    ...booking,
    experienceTitle: booking.experiences?.title || '',
    providerName: booking.experiences?.providers?.business_name || '',
  }));
}

/**
 * Get a single booking by ID
 */
export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch booking: ${error.message}`);
  }

  return data;
}

/**
 * Get upcoming bookings for a user
 */
export async function getUpcomingBookings(userId: string): Promise<BookingWithExperience[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      experiences(
        title,
        providers(business_name)
      )
    `)
    .eq('user_id', userId)
    .gte('start_at', now)
    .in('status', ['pending', 'confirmed'])
    .order('start_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch upcoming bookings: ${error.message}`);
  }

  return (data || []).map((booking: any) => ({
    ...booking,
    experienceTitle: booking.experiences?.title || '',
    providerName: booking.experiences?.providers?.business_name || '',
  }));
}

/**
 * Get past bookings for a user
 */
export async function getPastBookings(userId: string): Promise<BookingWithExperience[]> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      experiences(
        title,
        providers(business_name)
      )
    `)
    .eq('user_id', userId)
    .lt('start_at', now)
    .order('start_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch past bookings: ${error.message}`);
  }

  return (data || []).map((booking: any) => ({
    ...booking,
    experienceTitle: booking.experiences?.title || '',
    providerName: booking.experiences?.providers?.business_name || '',
  }));
}

/**
 * Cancel a booking
 */
export async function cancelBooking(id: string): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status: 'canceled' })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to cancel booking: ${error.message}`);
  }

  return data;
}

/**
 * Refresh QR token for a booking
 */
export async function refreshQRToken(bookingId: string): Promise<{ qrToken: string; expiresAt: string }> {
  // For now, generate a simple token client-side
  // In production, this should call an Edge Function
  const newToken = `refresh_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { error } = await supabase
    .from('bookings')
    .update({
      qr_token: newToken,
      qr_expires_at: expiresAt,
    })
    .eq('id', bookingId);

  if (error) {
    throw new Error(`Failed to refresh QR token: ${error.message}`);
  }

  return { qrToken: newToken, expiresAt };
}

/**
 * Get bookings for a provider's experiences
 */
export async function getProviderBookings(providerId: string): Promise<BookingWithExperience[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      experiences!inner(
        id,
        title,
        provider_id
      )
    `)
    .eq('experiences.provider_id', providerId)
    .order('start_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch provider bookings: ${error.message}`);
  }

  return (data || []).map((booking: any) => ({
    ...booking,
    experienceTitle: booking.experiences?.title || '',
    providerName: '', // Provider already knows their own name
  }));
}
