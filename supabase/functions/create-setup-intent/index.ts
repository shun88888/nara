import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

async function ensureCustomer(STRIPE_SECRET_KEY: string, user: { id: string; email?: string | null }) {
  const q = encodeURIComponent(`metadata['user_id']:'${user.id}'`);
  const searchResp = await fetch(`https://api.stripe.com/v1/customers/search?query=${q}`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
  });
  if (searchResp.ok) {
    const result = await searchResp.json();
    const found = result?.data?.find((c: any) => c?.metadata?.user_id === user.id);
    if (found) return found.id as string;
  }
  const payload = new URLSearchParams();
  if (user.email) payload.append('email', user.email);
  payload.append('metadata[user_id]', user.id);
  const resp = await fetch('https://api.stripe.com/v1/customers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
  });
  if (!resp.ok) throw new Error('Failed to create customer');
  const customer = await resp.json();
  return customer.id as string;
}

serve(async (req) => {
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
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(supabaseUrl, supabaseKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe secret not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const customerId = await ensureCustomer(STRIPE_SECRET_KEY, { id: user.id, email: user.email });

    const payload = new URLSearchParams();
    payload.append('customer', customerId);
    payload.append('usage', 'off_session');

    const resp = await fetch('https://api.stripe.com/v1/setup_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });
    if (!resp.ok) {
      const err = await resp.text();
      return new Response(JSON.stringify({ error: 'Stripe error', details: err }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const si = await resp.json();
    return new Response(JSON.stringify({ customerId, setupIntentClientSecret: si.client_secret }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});


