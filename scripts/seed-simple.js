// Simple seed script using fetch API
require('dotenv').config();

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Starting seed...');

  // First, get existing providers using REST API with correct headers
  const providersResponse = await fetch(`${SUPABASE_URL}/rest/v1/providers?select=id&limit=1`, {
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!providersResponse.ok) {
    const error = await providersResponse.text();
    console.error('Error fetching providers:', error);
    process.exit(1);
  }

  const providers = await providersResponse.json();
  console.log('Providers response:', providers);

  let providerId;

  if (!Array.isArray(providers) || providers.length === 0) {
    console.log('Creating demo provider...');

    // Create provider
    const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/providers`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        user_id: '00000000-0000-0000-0000-000000000000',
        business_name: '渋谷サイエンスラボ',
        description: 'STEM教育を中心とした体験教室',
        address: '東京都渋谷区1-1-1',
        phone: '03-1234-5678',
        is_active: true
      })
    });

    const newProvider = await createResponse.json();
    console.log('Created provider:', newProvider);

    if (Array.isArray(newProvider) && newProvider.length > 0) {
      providerId = newProvider[0].id;
    } else {
      console.error('Failed to create provider');
      process.exit(1);
    }
  } else {
    providerId = providers[0].id;
  }

  console.log('Using provider ID:', providerId);

  // Now create experiences
  const experiences = [
    {
      id: '33333333-3333-3333-3333-333333333301',
      provider_id: providerId,
      title: '火山の噴火実験',
      description: '重曹とクエン酸で火山の噴火を再現。化学反応の仕組みを楽しく学びます。',
      target_age: '6-10',
      duration_min: 60,
      price_yen: 2200,
      photos: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'],
      category: 'STEM',
      is_published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333302',
      provider_id: providerId,
      title: 'ドローン操縦体験',
      description: '最新のドローンを使った飛行体験。プログラミング制御にもチャレンジ。',
      target_age: '8-14',
      duration_min: 90,
      price_yen: 4500,
      photos: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'],
      category: 'STEM',
      is_published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333305',
      provider_id: providerId,
      title: 'アクリル画入門',
      description: '色鮮やかなアクリル絵の具で自由に描こう。抽象画から具象画まで。',
      target_age: '7-14',
      duration_min: 90,
      price_yen: 3200,
      photos: ['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'],
      category: 'Art',
      is_published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333309',
      provider_id: providerId,
      title: 'パン作り体験',
      description: '手ごねで作る本格パン。メロンパンやあんぱんに挑戦できます。',
      target_age: '6-13',
      duration_min: 120,
      price_yen: 3500,
      photos: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'],
      category: 'Cooking',
      is_published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333313',
      provider_id: providerId,
      title: 'サッカー教室',
      description: 'プロコーチから学ぶサッカーの基礎。ドリブルやシュートの練習。',
      target_age: '6-12',
      duration_min: 90,
      price_yen: 2500,
      photos: ['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800'],
      category: 'Sports',
      is_published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333317',
      provider_id: providerId,
      title: 'ピアノ個人レッスン',
      description: 'クラシックからポップスまで。好きな曲を弾けるように練習します。',
      target_age: '5-14',
      duration_min: 45,
      price_yen: 3500,
      photos: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800'],
      category: 'Music',
      is_published: true
    }
  ];

  console.log(`Inserting ${experiences.length} experiences...`);

  const expResponse = await fetch(`${SUPABASE_URL}/rest/v1/experiences`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation,resolution=merge-duplicates'
    },
    body: JSON.stringify(experiences)
  });

  const result = await expResponse.json();

  if (!expResponse.ok) {
    console.error('Error creating experiences:', result);
    process.exit(1);
  }

  console.log('✅ Successfully created experiences!');
  console.log('Result:', result);

  console.log('🎉 Seeding completed!');
}

seed().catch(console.error);
