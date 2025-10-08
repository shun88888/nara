# KIKKAKE (nara)

子供向け体験予約プラットフォーム

## 開発環境のセットアップ

```bash
npm install
npx expo start
```

## テストアカウント

### ユーザーアカウント（保護者）
```
Email: user1@example.com
Password: password123
```

### プロバイダーアカウント（事業者）
```
Email: provider1@example.com
Password: password123

Email: provider2@example.com
Password: password123

Email: provider3@example.com
Password: password123
```

## クイックログイン

サインイン画面に「開発用テストログイン」ボタンがあり、ワンクリックでテストアカウントにログインできます。

- 👤 ユーザー1でログイン - 保護者として体験を探す・予約する
- 🏢 プロバイダー1でログイン - 事業者として体験を管理する
- 🏢 プロバイダー2でログイン - 別の事業者アカウント

## 主な機能

### ユーザー（保護者）
- 体験の検索・閲覧
- 体験の予約
- 予約管理・QRコード表示
- プロフィール管理

### プロバイダー（事業者）
- 体験の作成・編集・削除
- 予約管理
- 今日の予約確認
- チェックイン機能

## 技術スタック

- **フロントエンド**: React Native (Expo)
- **バックエンド**: Supabase
- **認証**: Supabase Auth
- **データベース**: PostgreSQL (Supabase)
- **ナビゲーション**: Expo Router
- **状態管理**: Zustand
- **スタイリング**: NativeWind (Tailwind CSS)
