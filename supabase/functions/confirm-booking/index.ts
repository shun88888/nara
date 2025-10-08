import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { encode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const SERVER_SECRET = Deno.env.get('QR_SECRET') || 'your-secret-key-change-this';

interface BookingRequest {
  experienceId: string;
  childName: string;
  childAge: number;
  guardianName: string;
  guardianPhone: string;
  startAt: string; // ISO 8601 timestamp
  paymentMethod?: string;
  notes?: string;
  couponCode?: string;
}

interface QRPayload {
  bookingId: string;
  exp: number; // expiration timestamp
}

function generateQRToken(bookingId: string): string {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  const payload: QRPayload = { bookingId, exp: expiresAt };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = encode(payloadStr).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const signature = hmac('sha256', SERVER_SECRET, payloadB64, 'utf8', 'base64')
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  return `${payloadB64}.${signature}`;
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const bookingData: BookingRequest = await req.json();

    // Validate required fields
    if (
      !bookingData.experienceId ||
      !bookingData.childName ||
      !bookingData.childAge ||
      !bookingData.guardianName ||
      !bookingData.guardianPhone ||
      !bookingData.startAt
    ) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get experience details to calculate price
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('price_yen')
      .eq('id', bookingData.experienceId)
      .single();

    if (expError || !experience) {
      return new Response(JSON.stringify({ error: 'Experience not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate QR token
    const tempBookingId = crypto.randomUUID();
    const qrToken = generateQRToken(tempBookingId);
    const qrExpiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Insert booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        id: tempBookingId,
        user_id: user.id,
        experience_id: bookingData.experienceId,
        child_name: bookingData.childName,
        child_age: bookingData.childAge,
        guardian_name: bookingData.guardianName,
        guardian_phone: bookingData.guardianPhone,
        start_at: bookingData.startAt,
        status: 'confirmed',
        payment_method: bookingData.paymentMethod || 'pending',
        payment_status: 'pending', // Will be updated when Stripe is integrated
        amount_yen: experience.price_yen,
        qr_token: qrToken,
        qr_expires_at: qrExpiresAt,
        notes: bookingData.notes,
        coupon_code: bookingData.couponCode,
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking error:', bookingError);
      return new Response(JSON.stringify({ error: 'Failed to create booking' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ booking }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
