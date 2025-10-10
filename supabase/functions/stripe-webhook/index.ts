import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Minimal Stripe webhook signature verification using HMAC-SHA256
async function verifyStripeSignature(rawBody: string, sigHeader: string | null, secret: string): Promise<boolean> {
  if (!sigHeader) return false;
  // Stripe signature header format: t=timestamp,v1=signature
  const parts = sigHeader.split(',').reduce((acc: Record<string, string>, kv) => {
    const [k, v] = kv.split('=');
    if (k && v) acc[k] = v;
    return acc;
  }, {});
  const t = parts['t'];
  const v1 = parts['v1'];
  if (!t || !v1) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const data = encoder.encode(`${t}.${rawBody}`);
  const signature = await crypto.subtle.sign('HMAC', key, data);
  const hex = Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, '0')).join('');
  // Constant-time comparison would be preferable; this is acceptable for MVP
  return hex === v1;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
      },
    });
  }

  const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  if (!STRIPE_WEBHOOK_SECRET) {
    return new Response(JSON.stringify({ error: 'Webhook secret not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const sig = req.headers.get('stripe-signature');
  const raw = await req.text();
  const valid = await verifyStripeSignature(raw, sig, STRIPE_WEBHOOK_SECRET);
  if (!valid) {
    return new Response(JSON.stringify({ error: 'Invalid signature' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object;
        const pid = pi.id as string;
        await supabase
          .from('bookings')
          .update({ payment_status: 'succeeded' })
          .eq('stripe_payment_intent_id', pid);
        break;
      }
      case 'setup_intent.succeeded': {
        // Set default payment method for future off-session charges
        const si = event.data.object;
        const customerId = si.customer as string | null;
        const pmId = si.payment_method as string | null;
        const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')!;
        if (customerId && pmId) {
          await fetch(`https://api.stripe.com/v1/customers/${customerId}`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ 'invoice_settings[default_payment_method]': pmId }).toString(),
          });
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object;
        const pid = pi.id as string;
        await supabase
          .from('bookings')
          .update({ payment_status: 'failed' })
          .eq('stripe_payment_intent_id', pid);
        break;
      }
      case 'charge.refunded': {
        const charge = event.data.object;
        const pid = charge.payment_intent as string | null;
        if (pid) {
          await supabase
            .from('bookings')
            .update({ payment_status: 'refunded' })
            .eq('stripe_payment_intent_id', pid);
        }
        break;
      }
      default:
        // Ignore other events
        break;
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Processing error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});


