-- Seed data for testing
-- Note: This assumes you have manually created test users in Supabase Auth dashboard

-- Insert test providers (replace user_id with actual auth.users IDs from your Supabase dashboard)
-- For now, we'll create placeholder UUIDs that you should update

-- Provider 1: 大井町ロボット教室
INSERT INTO public.providers (id, user_id, business_name, description, address, phone, email, is_active)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000001'::uuid, -- Replace with actual user_id
  '大井町ロボット教室',
  'プログラミングとロボット工学を学べる教室です。お子様の創造力を育みます。',
  '東京都品川区大井町1-1-1',
  '03-1234-5001',
  'contact@oimachi-robot.jp',
  true
) ON CONFLICT (id) DO NOTHING;

-- Provider 2: 自由が丘 陶芸工房
INSERT INTO public.providers (id, user_id, business_name, description, address, is_active)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-000000000002'::uuid,
  'bbbbbbbb-bbbb-bbbb-bbbb-000000000002'::uuid,
  '自由が丘 陶芸工房',
  '親子で楽しめる陶芸体験。初心者でも本格的な作品が作れます。',
  '東京都目黒区自由が丘2-2-2',
  true
) ON CONFLICT (id) DO NOTHING;

-- Continue for all 10 providers...
INSERT INTO public.providers (id, user_id, business_name, description, address, is_active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000003'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000003'::uuid, '二子玉川アートスタジオ', '絵画からデジタルアートまで幅広く学べます', '東京都世田谷区玉川3-3-3', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000004'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000004'::uuid, '九品仏クッキングラボ', '料理を通じて食育を学ぶ教室', '東京都世田谷区九品仏4-4-4', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000005'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000005'::uuid, '尾山台ダンススタジオ', 'リズム感と表現力を育むダンス教室', '東京都世田谷区尾山台5-5-5', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000006'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000006'::uuid, '等々力プログラミング教室', 'Scratchから本格的なコーディングまで', '東京都世田谷区等々力6-6-6', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000007'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000007'::uuid, '上野毛音楽教室', '楽器演奏を通じて音楽の楽しさを', '東京都世田谷区上野毛7-7-7', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000008'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000008'::uuid, '田園調布サイエンスラボ', '科学実験で好奇心を刺激', '東京都世田谷区田園調布8-8-8', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000009'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000009'::uuid, '自由が丘フラワーショップ', 'お花を通じて感性を磨く', '東京都目黒区自由が丘9-9-9', true),
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000010'::uuid, 'bbbbbbbb-bbbb-bbbb-bbbb-000000000010'::uuid, '大岡山スポーツクラブ', '運動能力と協調性を育む', '東京都目黒区大岡山10-10-10', true)
ON CONFLICT (id) DO NOTHING;

-- Insert experiences
INSERT INTO public.experiences (id, provider_id, title, description, target_age, duration_min, price_yen, photos, category, is_published)
VALUES
  (
    'exp00000-0000-0000-0000-000000000001'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000001'::uuid,
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
    'exp00000-0000-0000-0000-000000000002'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000002'::uuid,
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
    'exp00000-0000-0000-0000-000000000003'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000003'::uuid,
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
    'exp00000-0000-0000-0000-000000000004'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000004'::uuid,
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
    'exp00000-0000-0000-0000-000000000005'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000005'::uuid,
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
    'exp00000-0000-0000-0000-000000000006'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000006'::uuid,
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
    'exp00000-0000-0000-0000-000000000007'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000007'::uuid,
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
    'exp00000-0000-0000-0000-000000000008'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000008'::uuid,
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
    'exp00000-0000-0000-0000-000000000009'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000009'::uuid,
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
    'exp00000-0000-0000-0000-000000000010'::uuid,
    'aaaaaaaa-aaaa-aaaa-aaaa-000000000010'::uuid,
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
