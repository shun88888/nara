-- Demo Seed Data for Quick Testing
-- Run this in Supabase SQL Editor after creating the schema

-- First, create a test provider user manually in Supabase Auth Dashboard
-- Then replace the UUID below with the actual auth.users ID

-- Step 1: Insert a provider (replace the user_id with your actual auth user ID)
INSERT INTO public.providers (id, user_id, business_name, description, address, phone, is_active)
VALUES (
  '11111111-1111-1111-1111-111111111111'::uuid,
  'YOUR_AUTH_USER_ID_HERE'::uuid, -- ⚠️ REPLACE THIS with actual auth.users ID
  'デモ教室',
  'テスト用の教室です',
  '東京都渋谷区1-1-1',
  '03-1234-5678',
  true
) ON CONFLICT (id) DO NOTHING;

-- Step 2: Insert demo experiences
INSERT INTO public.experiences (id, provider_id, title, description, target_age, duration_min, price_yen, photos, category, is_published)
VALUES
  (
    '22222222-2222-2222-2222-222222222221'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'ロボット作り体験',
    'ギアとモーターで動くロボットを組み立てて、プログラミングの基礎を学びます。LEDライトやセンサーを使って、自分だけのオリジナルロボットを作成します。',
    '6-12',
    90,
    3500,
    ARRAY['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800'],
    'STEM',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '親子で陶芸体験',
    '電動ろくろを使って本格的な器作りに挑戦。お茶碗や湯呑みなど、実用的な作品を作れます。',
    '5-12',
    120,
    4000,
    ARRAY['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800'],
    'Art',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222223'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '水彩画教室',
    'プロの画家から学ぶ本格水彩画レッスン。風景画や静物画の描き方を基礎から学びます。',
    '8-15',
    60,
    2500,
    ARRAY['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'],
    'Art',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222224'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    '本格ピザ作り教室',
    '生地から作る本格ナポリピザ体験。生地のこね方から窯での焼き方まで学べます。',
    '6-14',
    90,
    3000,
    ARRAY['https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'],
    'Cooking',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222225'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'キッズダンスレッスン',
    'ヒップホップダンスの基礎を楽しく学ぼう。リズム感と表現力を育みます。',
    '5-12',
    60,
    2000,
    ARRAY['https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800'],
    'Sports',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222226'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'Scratchでゲーム作り',
    '初めてのプログラミングで簡単なゲームを作成。論理的思考力を養います。',
    '7-13',
    90,
    3500,
    ARRAY['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800'],
    'STEM',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222227'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'ドラム体験レッスン',
    '本物のドラムセットで叩いてみよう。基本のリズムパターンを学べます。',
    '6-14',
    45,
    2500,
    ARRAY['https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=800'],
    'Music',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222228'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'スライム作り実験教室',
    '科学の不思議を楽しく学ぶ実験体験。色とりどりのスライムを作ります。',
    '5-11',
    60,
    1800,
    ARRAY['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'],
    'STEM',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222229'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'フラワーアレンジメント',
    'お花を使った可愛いアレンジメント作り。色彩感覚と創造力を育みます。',
    '6-13',
    75,
    2800,
    ARRAY['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800'],
    'Art',
    true
  ),
  (
    '22222222-2222-2222-2222-222222222230'::uuid,
    '11111111-1111-1111-1111-111111111111'::uuid,
    'ボルダリング体験',
    '室内クライミングで体を動かそう。バランス感覚と集中力を養います。',
    '7-15',
    90,
    3200,
    ARRAY['https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800'],
    'Sports',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the data
SELECT
  e.id,
  e.title,
  p.business_name as provider_name,
  e.price_yen,
  e.is_published
FROM experiences e
JOIN providers p ON e.provider_id = p.id
ORDER BY e.created_at DESC;
