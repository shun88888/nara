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
  paymentMethod?: 'credit' | 'onsite';
  stripePaymentIntentId?: string;
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
 * Create a Stripe PaymentIntent via Edge Function
 */
export async function createPaymentIntent(params: { experienceId: string; couponCode?: string; customerId?: string }): Promise<{
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
}> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: params,
  });

  if (error) {
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }

  return data as any;
}

/**
 * Get or create Stripe Customer for current user
 */
export async function getOrCreateStripeCustomer(): Promise<{ customerId: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.functions.invoke('create-or-get-customer');
  if (error) throw new Error(`Failed to get customer: ${error.message}`);
  return data as any;
}

/**
 * Create Ephemeral Key for PaymentSheet
 */
export async function createEphemeralKey(): Promise<{ customerId: string; ephemeralKeySecret: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.functions.invoke('create-ephemeral-key', {
    headers: { 'Stripe-Version': '2024-06-20' },
  } as any);
  if (error) throw new Error(`Failed to create ephemeral key: ${error.message}`);
  return data as any;
}

/**
 * Create SetupIntent for adding a card
 */
export async function createSetupIntent(): Promise<{ customerId: string; setupIntentClientSecret: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.functions.invoke('create-setup-intent');
  if (error) throw new Error(`Failed to create setup intent: ${error.message}`);
  return data as any;
}

/**
 * Check if user has saved card in Stripe
 */
export async function hasSavedCard(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.functions.invoke('list-payment-methods');
  if (error) throw new Error(`Failed to list payment methods: ${error.message}`);
  return Boolean((data as any)?.hasSavedCard);
}

/**
 * Get saved card summary (brand, last4, exp)
 */
export async function getSavedCardSummary(): Promise<{ hasSavedCard: boolean; summary?: { brand: string | null; last4: string | null; exp_month: number | null; exp_year: number | null } }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.functions.invoke('list-payment-methods');
  if (error) throw new Error(`Failed to list payment methods: ${error.message}`);
  return data as any;
}

/**
 * Charge saved card off-session
 */
export async function chargeSavedCard(params: { amountYen: number; experienceId: string }): Promise<{ paymentIntentId: string; status: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.functions.invoke('charge-saved-card', {
    body: { amount_yen: params.amountYen, experienceId: params.experienceId },
  });
  if (error) throw new Error(`Failed to charge card: ${error.message}`);
  return data as any;
}

export async function getSavedCards(): Promise<{ customerId: string; defaultPaymentMethodId: string | null; cards: { id: string; brand: string | null; last4: string | null; exp_month: number | null; exp_year: number | null }[] }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { data, error } = await supabase.functions.invoke('list-payment-methods');
  if (error) throw new Error(`Failed to list payment methods: ${error.message}`);
  return data as any;
}

export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { error } = await supabase.functions.invoke('set-default-payment-method', { body: { payment_method_id: paymentMethodId } });
  if (error) throw new Error(`Failed to set default: ${error.message}`);
}

export async function deletePaymentMethod(paymentMethodId: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');
  const { error } = await supabase.functions.invoke('delete-payment-method', { body: { payment_method_id: paymentMethodId } });
  if (error) throw new Error(`Failed to delete card: ${error.message}`);
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
