/*
  Automates Stripe webhook setup and stores signing secret in Supabase secrets.
  Usage:
    node scripts/setup-stripe-webhook.mjs

  Env (optional):
    STRIPE_SECRET_KEY=sk_test_...
    SUPABASE_PROJECT_REF=nzkcktausubexsfoqloo
*/

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY environment variable is required');
  process.exit(1);
}
const SUPABASE_PROJECT_REF = process.env.SUPABASE_PROJECT_REF || 'nzkcktausubexsfoqloo';
const ENDPOINT_URL = `https://${SUPABASE_PROJECT_REF}.functions.supabase.co/stripe-webhook`;

async function stripeApi(path, options = {}) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) {
    throw new Error(`Stripe ${path} failed: ${res.status} ${text}`);
  }
  return json;
}

function toForm(params) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => usp.append(k, String(v)));
  return usp.toString();
}

async function ensureSupabaseLinked() {
  await execFileAsync('supabase', ['link', '--project-ref', SUPABASE_PROJECT_REF]);
}

async function setSupabaseSecret(name, value) {
  await execFileAsync('supabase', ['secrets', 'set', `${name}=${value}`]);
}

async function main() {
  console.log(`Endpoint URL: ${ENDPOINT_URL}`);
  await ensureSupabaseLinked();

  // Try create webhook
  let webhookId = '';
  let signingSecret = '';
  try {
    const created = await stripeApi('/webhook_endpoints', {
      method: 'POST',
      body: toForm({
        url: ENDPOINT_URL,
        'enabled_events[]': 'payment_intent.succeeded',
        'enabled_events[]': 'payment_intent.payment_failed',
        'enabled_events[]': 'charge.refunded',
        api_version: '2024-06-20',
      }),
    });
    webhookId = created.id;
    signingSecret = created.secret || '';
  } catch (e) {
    // ignore create error; likely already exists
  }

  if (!signingSecret) {
    // Find existing endpoint
    const list = await stripeApi('/webhook_endpoints?limit=100');
    const found = (list.data || []).find((ep) => ep.url === ENDPOINT_URL);
    if (!found) {
      throw new Error('Failed to create/find webhook endpoint');
    }
    webhookId = found.id;
    // Rotate secret to obtain new signing secret
    const rotated = await stripeApi(`/webhook_endpoints/${webhookId}/secret/rotate`, { method: 'POST' });
    signingSecret = rotated.secret;
  }

  if (!signingSecret) {
    throw new Error('Failed to obtain webhook signing secret');
  }

  await setSupabaseSecret('STRIPE_WEBHOOK_SECRET', signingSecret);
  const masked = `${signingSecret.slice(0, 7)}********${signingSecret.slice(-4)}`;
  console.log(`OK WebhookID=${webhookId} Secret=${masked}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});


