import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-version',
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

    const stripeVersion = req.headers.get('Stripe-Version') || '2024-06-20';
    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe secret not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Try getting customerId from profiles
    let customerId: string | null = null;
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();
    if (profile?.stripe_customer_id) customerId = profile.stripe_customer_id;

    // Fallback: search or create in Stripe
    if (!customerId) {
      // Search
      const searchResp = await fetch('https://api.stripe.com/v1/customers/search?query=' + encodeURIComponent(`metadata['user_id']:'${user.id}'`), {
        headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
      });
      if (searchResp.ok) {
        const result = await searchResp.json();
        const found = result?.data?.find((c: any) => c?.metadata?.user_id === user.id);
        if (found) customerId = found.id;
      }
      // Create
      if (!customerId) {
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
        if (!resp.ok) {
          const err = await resp.text();
          return new Response(JSON.stringify({ error: 'Stripe error', details: err }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        const customer = await resp.json();
        customerId = customer.id;
      }
    }

    if (!customerId) {
      return new Response(JSON.stringify({ error: 'Failed to get/create customer' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Create Ephemeral Key
    const payload = new URLSearchParams();
    payload.append('customer', customerId);

    const resp = await fetch('https://api.stripe.com/v1/ephemeral_keys', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Stripe-Version': stripeVersion,
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

    const key = await resp.json();
    return new Response(JSON.stringify({ customerId, ephemeralKeySecret: key.secret }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});


