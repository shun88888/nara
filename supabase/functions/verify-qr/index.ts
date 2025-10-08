import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { decode } from 'https://deno.land/std@0.168.0/encoding/base64.ts';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const SERVER_SECRET = Deno.env.get('QR_SECRET') || 'your-secret-key-change-this';

interface QRPayload {
  bookingId: string;
  exp: number;
}

function verifyQRToken(token: string): { valid: boolean; bookingId?: string; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) {
      return { valid: false, error: 'Invalid token format' };
    }

    const [payloadB64, signatureB64] = parts;

    // Verify signature
    const expectedSignature = hmac('sha256', SERVER_SECRET, payloadB64, 'utf8', 'base64')
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    if (signatureB64 !== expectedSignature) {
      return { valid: false, error: 'Invalid signature' };
    }

    // Decode payload
    const payloadStr = new TextDecoder().decode(
      decode(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    );
    const payload: QRPayload = JSON.parse(payloadStr);

    // Check expiration
    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Token expired' };
    }

    return { valid: true, bookingId: payload.bookingId };
  } catch (error) {
    return { valid: false, error: 'Invalid token' };
  }
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Use service role key for provider verification
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { qrToken, action } = await req.json();

    if (!qrToken) {
      return new Response(JSON.stringify({ error: 'QR token required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify QR token
    const verification = verifyQRToken(qrToken);

    if (!verification.valid) {
      return new Response(
        JSON.stringify({ valid: false, error: verification.error }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*, experiences(*), users(*)')
      .eq('id', verification.bookingId)
      .single();

    if (bookingError || !booking) {
      return new Response(JSON.stringify({ valid: false, error: 'Booking not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Check if booking is valid
    if (booking.status === 'canceled') {
      return new Response(
        JSON.stringify({ valid: false, error: 'Booking has been canceled' }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // If action is check-in, update booking status
    if (action === 'check_in' && booking.status === 'confirmed') {
      await supabase
        .from('bookings')
        .update({ status: 'checked_in' })
        .eq('id', verification.bookingId);

      return new Response(
        JSON.stringify({
          valid: true,
          booking: { ...booking, status: 'checked_in' },
          message: 'Successfully checked in',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    return new Response(JSON.stringify({ valid: true, booking }), {
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
