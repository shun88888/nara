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
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY');
    if (!STRIPE_SECRET_KEY) {
      return new Response(JSON.stringify({ error: 'Stripe secret not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Find customer by metadata
    const q = encodeURIComponent(`metadata['user_id']:'${user.id}'`);
    const searchResp = await fetch(`https://api.stripe.com/v1/customers/search?query=${q}`, { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } });
    if (!searchResp.ok) {
      const err = await searchResp.text();
      return new Response(JSON.stringify({ error: 'Stripe error', details: err }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const result = await searchResp.json();
    const customer = result?.data?.find((c: any) => c?.metadata?.user_id === user.id);
    if (!customer) {
      return new Response(JSON.stringify({ hasSavedCard: false }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
    }

    // Fetch default payment method for summary
    const custResp = await fetch(`https://api.stripe.com/v1/customers/${customer.id}`, { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } });
    if (!custResp.ok) {
      const err = await custResp.text();
      return new Response(JSON.stringify({ error: 'Stripe error', details: err }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const cust = await custResp.json();
    const defaultPmId = cust?.invoice_settings?.default_payment_method || null;

    // fetch all cards for display
    const pmListResp = await fetch(`https://api.stripe.com/v1/payment_methods?customer=${customer.id}&type=card`, { headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` } });
    const pmList = pmListResp.ok ? await pmListResp.json() : { data: [] };
    const cards = (pmList.data || []).map((pm: any) => ({
      id: pm.id,
      brand: pm?.card?.brand || null,
      last4: pm?.card?.last4 || null,
      exp_month: pm?.card?.exp_month || null,
      exp_year: pm?.card?.exp_year || null,
    }));
    const hasSavedCard = cards.length > 0;
    return new Response(JSON.stringify({ customerId: customer.id, defaultPaymentMethodId: defaultPmId, cards, hasSavedCard }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});


