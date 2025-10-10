import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Use Stripe REST API via fetch to avoid npm deps in Deno Edge Functions

interface CreateIntentRequest {
  experienceId: string;
  couponCode?: string;
  customerId?: string;
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

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

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

    const body: CreateIntentRequest = await req.json();
    if (!body.experienceId) {
      return new Response(JSON.stringify({ error: 'experienceId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('price_yen')
      .eq('id', body.experienceId)
      .single();
    if (expError || !experience) {
      return new Response(JSON.stringify({ error: 'Experience not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe secret not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = new URLSearchParams();
    payload.append('amount', String(experience.price_yen));
    payload.append('currency', 'jpy');
    payload.append('automatic_payment_methods[enabled]', 'true');
    payload.append('metadata[user_id]', user.id);
    payload.append('metadata[experience_id]', body.experienceId);
    if (body.customerId) {
      payload.append('customer', body.customerId);
      payload.append('setup_future_usage', 'off_session');
    }

    const resp = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return new Response(JSON.stringify({ error: 'Stripe error', details: err }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const intent = await resp.json();
    return new Response(JSON.stringify({ clientSecret: intent.client_secret, paymentIntentId: intent.id, amount: intent.amount }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('create-payment-intent error:', error);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});


