import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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
    if (authError || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

    const { amount_yen, experienceId } = await req.json();
    if (!amount_yen || !experienceId) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) return new Response(JSON.stringify({ error: 'Stripe secret not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // get customer by metadata
    const q = encodeURIComponent(`metadata['user_id']:'${user.id}'`);
    const searchResp = await fetch(`https://api.stripe.com/v1/customers/search?query=${q}`, { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } });
    if (!searchResp.ok) {
      const err = await searchResp.text();
      return new Response(JSON.stringify({ error: 'Stripe error', details: err }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const result = await searchResp.json();
    const customer = result?.data?.find((c: any) => c?.metadata?.user_id === user.id);
    if (!customer) return new Response(JSON.stringify({ error: 'No customer found' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Create and confirm PaymentIntent off-session
    const payload = new URLSearchParams();
    payload.append('amount', String(amount_yen));
    payload.append('currency', 'jpy');
    payload.append('customer', customer.id);
    payload.append('confirm', 'true');
    payload.append('off_session', 'true');
    payload.append('automatic_payment_methods[enabled]', 'true');
    payload.append('metadata[user_id]', user.id);
    payload.append('metadata[experience_id]', experienceId);

    const resp = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload.toString(),
    });

    const body = await resp.json();
    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'Stripe error', details: body }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ paymentIntentId: body.id, status: body.status }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});


