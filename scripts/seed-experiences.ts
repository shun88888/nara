import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env file');
  process.exit(1);
}

// Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function seedExperiences() {
  console.log('🌱 Starting to seed experiences...');

  // Get the first provider
  const { data: providers, error: providerError } = await supabase
    .from('providers')
    .select('id')
    .limit(1);

  if (providerError) {
    console.error('Error fetching providers:', providerError);
    process.exit(1);
  }

  if (!providers || providers.length === 0) {
    console.log('⚠️  No providers found. Creating a demo provider...');

    // Create a demo provider
    const { data: newProvider, error: createError } = await supabase
      .from('providers')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Placeholder
        business_name: '渋谷サイエンスラボ',
        description: 'STEM教育を中心とした体験教室',
        address: '東京都渋谷区1-1-1',
        phone: '03-1234-5678',
        is_active: true,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating provider:', createError);
      process.exit(1);
    }

    console.log('✅ Created demo provider:', newProvider.business_name);
    providers.push(newProvider);
  }

  const providerId = providers[0].id;
  console.log(`✅ Using provider ID: ${providerId}`);

  const experiences = [
    // STEM experiences
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
      is_published: true,
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
      is_published: true,
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
      is_published: true,
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
      is_published: true,
    },

    // Art experiences
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
      is_published: true,
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
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333307',
      provider_id: providerId,
      title: 'ガラス細工ワークショップ',
      description: 'とんぼ玉やアクセサリーパーツをガラスで作成。美しい作品作り。',
      target_age: '10-15',
      duration_min: 90,
      price_yen: 3800,
      photos: ['https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800'],
      category: 'Art',
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333308',
      provider_id: providerId,
      title: '書道教室 - 筆で遊ぼう',
      description: '墨と筆を使った本格書道体験。美しい文字の書き方を学びます。',
      target_age: '6-12',
      duration_min: 60,
      price_yen: 2000,
      photos: ['https://images.unsplash.com/photo-1543511187-7d2c9f0e8cd3?w=800'],
      category: 'Art',
      is_published: true,
    },

    // Cooking experiences
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
      is_published: true,
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
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333311',
      provider_id: providerId,
      title: '和菓子作り体験',
      description: '練り切りや大福など、季節の和菓子を手作り。日本の伝統文化に触れます。',
      target_age: '8-14',
      duration_min: 90,
      price_yen: 3200,
      photos: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800'],
      category: 'Cooking',
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333312',
      provider_id: providerId,
      title: 'デコ弁当作り',
      description: 'キャラクターや動物をモチーフにした可愛いお弁当作り。',
      target_age: '7-12',
      duration_min: 75,
      price_yen: 2500,
      photos: ['https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800'],
      category: 'Cooking',
      is_published: true,
    },

    // Sports experiences
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
      is_published: true,
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
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333315',
      provider_id: providerId,
      title: 'バスケットボール教室',
      description: 'シュートやドリブルの基礎から、チームプレーまで楽しく学びます。',
      target_age: '7-13',
      duration_min: 90,
      price_yen: 2800,
      photos: ['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
      category: 'Sports',
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333316',
      provider_id: providerId,
      title: 'テニス体験レッスン',
      description: '初心者向けテニス教室。ラケットの握り方からサーブまで丁寧に指導。',
      target_age: '8-15',
      duration_min: 90,
      price_yen: 3000,
      photos: ['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800'],
      category: 'Sports',
      is_published: true,
    },

    // Music experiences
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
      is_published: true,
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
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333319',
      provider_id: providerId,
      title: 'ギター入門教室',
      description: 'アコースティックギターの基本コードから簡単な曲まで弾けるように。',
      target_age: '9-15',
      duration_min: 75,
      price_yen: 3200,
      photos: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'],
      category: 'Music',
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333320',
      provider_id: providerId,
      title: 'バイオリン体験',
      description: '美しい音色のバイオリンに触れてみよう。基本の弾き方を学びます。',
      target_age: '6-13',
      duration_min: 60,
      price_yen: 3800,
      photos: ['https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800'],
      category: 'Music',
      is_published: true,
    },

    // Other experiences
    {
      id: '33333333-3333-3333-3333-333333333321',
      provider_id: providerId,
      title: '茶道体験',
      description: '日本の伝統文化、茶道の作法を学びます。お抹茶とお菓子付き。',
      target_age: '8-15',
      duration_min: 90,
      price_yen: 3000,
      photos: ['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800'],
      category: 'Other',
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333322',
      provider_id: providerId,
      title: '乗馬体験',
      description: '優しい馬とふれあい、馬場で乗馬体験。動物との触れ合いを楽しめます。',
      target_age: '7-15',
      duration_min: 60,
      price_yen: 4500,
      photos: ['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800'],
      category: 'Other',
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333323',
      provider_id: providerId,
      title: '手話教室',
      description: '手話の基礎を学び、コミュニケーションの大切さを体験します。',
      target_age: '8-14',
      duration_min: 60,
      price_yen: 2000,
      photos: ['https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800'],
      category: 'Other',
      is_published: true,
    },
    {
      id: '33333333-3333-3333-3333-333333333324',
      provider_id: providerId,
      title: 'マジック教室',
      description: 'プロのマジシャンから学ぶ手品の基礎。みんなを驚かせよう！',
      target_age: '7-13',
      duration_min: 75,
      price_yen: 2800,
      photos: ['https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800'],
      category: 'Other',
      is_published: true,
    },
  ];

  console.log(`📝 Inserting ${experiences.length} experiences...`);

  const { data, error } = await supabase
    .from('experiences')
    .upsert(experiences, { onConflict: 'id' });

  if (error) {
    console.error('❌ Error inserting experiences:', error);
    process.exit(1);
  }

  console.log('✅ Successfully seeded experiences!');
  console.log(`📊 Total experiences added: ${experiences.length}`);

  // Verify
  const { count } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true });

  console.log(`✅ Total experiences in database: ${count}`);
}

seedExperiences()
  .then(() => {
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
