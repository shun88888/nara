const SUPABASE_URL = 'https://nzkcktausubexsfoqloo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56a2NrdGF1c3ViZXhzZm9xbG9vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkxMjg3MiwiZXhwIjoyMDc1NDg4ODcyfQ.13wWTmq6KMLLK-MfsMBOSKJ0AhdASdZ9Rwq3KGInc6k';

async function seed() {
  console.log('🌱 Seeding experiences...');

  const res = await fetch(`${SUPABASE_URL}/rest/v1/providers?select=id&limit=1`, {
    headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` }
  });
  const providers = await res.json();
  
  if (!Array.isArray(providers) || !providers[0]) {
    console.error('Error:', providers);
    return;
  }

  const providerId = providers[0].id;
  console.log('✅ Using provider:', providerId);

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
      id: '33333333-3333-3333-3333-333333333303',
      provider_id: providerId,
      title: '電子工作入門',
      description: 'LEDライトと電池で簡単な電子回路を作成。電気の基礎を学びます。',
      target_age: '7-12',
      duration_min: 75,
      price_yen: 3000,
      photos: ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'],
      category: 'STEM',
      is_published: true
    },
    {
      id: '33333333-3333-3333-3333-333333333304',
      provider_id: providerId,
      title: '顕微鏡で見るミクロの世界',
      description: '顕微鏡を使って肉眼では見えない微生物や細胞を観察します。',
      target_age: '8-13',
      duration_min: 60,
      price_yen: 2800,
      photos: ['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800'],
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
      id: '33333333-3333-3333-3333-333333333306',
      provider_id: providerId,
      title: 'レザークラフト体験',
      description: '本革を使ってキーホルダーやコインケースを作成。刻印も入れられます。',
      target_age: '9-15',
      duration_min: 120,
      price_yen: 4200,
      photos: ['https://images.unsplash.com/photo-1608528220784-cf9a5f2d8c60?w=800'],
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
      id: '33333333-3333-3333-3333-333333333310',
      provider_id: providerId,
      title: 'お菓子作り教室',
      description: 'クッキーやマフィンを焼いてデコレーション。可愛いお菓子作り。',
      target_age: '5-11',
      duration_min: 90,
      price_yen: 2800,
      photos: ['https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800'],
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
      id: '33333333-3333-3333-3333-333333333314',
      provider_id: providerId,
      title: '空手入門',
      description: '礼儀作法から基本の型まで。心身を鍛える武道体験。',
      target_age: '6-14',
      duration_min: 60,
      price_yen: 2200,
      photos: ['https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800'],
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
    },
    {
      id: '33333333-3333-3333-3333-333333333318',
      provider_id: providerId,
      title: 'ボーカルレッスン',
      description: '発声練習から歌唱指導まで。楽しく歌を学びましょう。',
      target_age: '7-15',
      duration_min: 60,
      price_yen: 3000,
      photos: ['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'],
      category: 'Music',
      is_published: true
    }
  ];

  console.log(`📝 Adding ${experiences.length} experiences...`);

  const expRes = await fetch(`${SUPABASE_URL}/rest/v1/experiences`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(experiences)
  });

  if (expRes.ok) {
    console.log('✅ Success!');
  } else {
    const error = await expRes.text();
    console.error('❌ Error:', error);
  }
}

seed();
