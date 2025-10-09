-- Add more test data for experiences
-- Run this in Supabase SQL Editor to add 20+ more experiences

INSERT INTO public.experiences (id, provider_id, title, description, target_age, duration_min, price_yen, photos, category, is_published)
VALUES
  -- STEM experiences
  (
    '33333333-3333-3333-3333-333333333301'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '火山の噴火実験',
    '重曹とクエン酸で火山の噴火を再現。化学反応の仕組みを楽しく学びます。',
    '6-10',
    60,
    2200,
    ARRAY['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800'],
    'STEM',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333302'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'ドローン操縦体験',
    '最新のドローンを使った飛行体験。プログラミング制御にもチャレンジ。',
    '8-14',
    90,
    4500,
    ARRAY['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'],
    'STEM',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333303'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '電子工作入門',
    'LEDライトと電池で簡単な電子回路を作成。電気の基礎を学びます。',
    '7-12',
    75,
    3000,
    ARRAY['https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800'],
    'STEM',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333304'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '顕微鏡で見るミクロの世界',
    '顕微鏡を使って肉眼では見えない微生物や細胞を観察します。',
    '8-13',
    60,
    2800,
    ARRAY['https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800'],
    'STEM',
    true
  ),

  -- Art experiences
  (
    '33333333-3333-3333-3333-333333333305'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'アクリル画入門',
    '色鮮やかなアクリル絵の具で自由に描こう。抽象画から具象画まで。',
    '7-14',
    90,
    3200,
    ARRAY['https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800'],
    'Art',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333306'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'レザークラフト体験',
    '本革を使ってキーホルダーやコインケースを作成。刻印も入れられます。',
    '9-15',
    120,
    4200,
    ARRAY['https://images.unsplash.com/photo-1608528220784-cf9a5f2d8c60?w=800'],
    'Art',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333307'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'ガラス細工ワークショップ',
    'とんぼ玉やアクセサリーパーツをガラスで作成。美しい作品作り。',
    '10-15',
    90,
    3800,
    ARRAY['https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=800'],
    'Art',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333308'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '書道教室 - 筆で遊ぼう',
    '墨と筆を使った本格書道体験。美しい文字の書き方を学びます。',
    '6-12',
    60,
    2000,
    ARRAY['https://images.unsplash.com/photo-1543511187-7d2c9f0e8cd3?w=800'],
    'Art',
    true
  ),

  -- Cooking experiences
  (
    '33333333-3333-3333-3333-333333333309'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'パン作り体験',
    '手ごねで作る本格パン。メロンパンやあんぱんに挑戦できます。',
    '6-13',
    120,
    3500,
    ARRAY['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800'],
    'Cooking',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333310'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'お菓子作り教室',
    'クッキーやマフィンを焼いてデコレーション。可愛いお菓子作り。',
    '5-11',
    90,
    2800,
    ARRAY['https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800'],
    'Cooking',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333311'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '和菓子作り体験',
    '練り切りや大福など、季節の和菓子を手作り。日本の伝統文化に触れます。',
    '8-14',
    90,
    3200,
    ARRAY['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800'],
    'Cooking',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333312'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'デコ弁当作り',
    'キャラクターや動物をモチーフにした可愛いお弁当作り。',
    '7-12',
    75,
    2500,
    ARRAY['https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800'],
    'Cooking',
    true
  ),

  -- Sports experiences
  (
    '33333333-3333-3333-3333-333333333313'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'サッカー教室',
    'プロコーチから学ぶサッカーの基礎。ドリブルやシュートの練習。',
    '6-12',
    90,
    2500,
    ARRAY['https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800'],
    'Sports',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333314'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '空手入門',
    '礼儀作法から基本の型まで。心身を鍛える武道体験。',
    '6-14',
    60,
    2200,
    ARRAY['https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800'],
    'Sports',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333315'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'バスケットボール教室',
    'シュートやドリブルの基礎から、チームプレーまで楽しく学びます。',
    '7-13',
    90,
    2800,
    ARRAY['https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800'],
    'Sports',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333316'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'テニス体験レッスン',
    '初心者向けテニス教室。ラケットの握り方からサーブまで丁寧に指導。',
    '8-15',
    90,
    3000,
    ARRAY['https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800'],
    'Sports',
    true
  ),

  -- Music experiences
  (
    '33333333-3333-3333-3333-333333333317'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'ピアノ個人レッスン',
    'クラシックからポップスまで。好きな曲を弾けるように練習します。',
    '5-14',
    45,
    3500,
    ARRAY['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800'],
    'Music',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333318'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'ボーカルレッスン',
    '発声練習から歌唱指導まで。楽しく歌を学びましょう。',
    '7-15',
    60,
    3000,
    ARRAY['https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800'],
    'Music',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333319'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'ギター入門教室',
    'アコースティックギターの基本コードから簡単な曲まで弾けるように。',
    '9-15',
    75,
    3200,
    ARRAY['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'],
    'Music',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333320'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'バイオリン体験',
    '美しい音色のバイオリンに触れてみよう。基本の弾き方を学びます。',
    '6-13',
    60,
    3800,
    ARRAY['https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=800'],
    'Music',
    true
  ),

  -- Other experiences
  (
    '33333333-3333-3333-3333-333333333321'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '茶道体験',
    '日本の伝統文化、茶道の作法を学びます。お抹茶とお菓子付き。',
    '8-15',
    90,
    3000,
    ARRAY['https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800'],
    'Other',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333322'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '乗馬体験',
    '優しい馬とふれあい、馬場で乗馬体験。動物との触れ合いを楽しめます。',
    '7-15',
    60,
    4500,
    ARRAY['https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800'],
    'Other',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333323'::uuid,
    (SELECT id FROM providers LIMIT 1),
    '手話教室',
    '手話の基礎を学び、コミュニケーションの大切さを体験します。',
    '8-14',
    60,
    2000,
    ARRAY['https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800'],
    'Other',
    true
  ),
  (
    '33333333-3333-3333-3333-333333333324'::uuid,
    (SELECT id FROM providers LIMIT 1),
    'マジック教室',
    'プロのマジシャンから学ぶ手品の基礎。みんなを驚かせよう！',
    '7-13',
    75,
    2800,
    ARRAY['https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800'],
    'Other',
    true
  )
ON CONFLICT (id) DO NOTHING;

-- Verify the new data
SELECT
  e.title,
  e.category,
  e.price_yen,
  e.target_age
FROM experiences e
WHERE e.id::text LIKE '33333333%'
ORDER BY e.category, e.title;
