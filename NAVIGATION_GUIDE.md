# Navigation & Redirect Guidelines

## 無限リダイレクトループを防ぐためのガイドライン

### ❌ 絶対にやってはいけないこと

1. **レンダリング中に`setState`を呼び出す**
```tsx
// ❌ BAD
if (session && !isRedirecting) {
  setIsRedirecting(true); // レンダリング中のsetState
  return <Redirect />;
}
```

2. **循環リダイレクト**
```tsx
// ❌ BAD
// Screen A -> Screen B -> Screen A の循環
```

3. **条件なしの相互リダイレクト**
```tsx
// ❌ BAD
// index.tsx: if (!session) <Redirect href="/onboarding" />
// onboarding.tsx: if (!ready) <Redirect href="/" />
// これは無限ループになる可能性がある
```

### ✅ ベストプラクティス

#### 1. セッション初期化を待つ

```tsx
export default function Index() {
  const { session, loadSession, initialized } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      if (!initialized) {
        await loadSession();
      }
      setIsLoading(false);
    }
    init();
  }, [initialized]);

  // ローディング中は表示
  if (isLoading || !initialized) {
    return <LoadingScreen />;
  }

  // セッション確認後にリダイレクト
  if (!session) return <Redirect href="/(auth)/sign-in" />;
  if (session.role === 'provider') return <Redirect href="/(provider)/(tabs)/today" />;
  return <Redirect href="/(user)/(tabs)/home" />;
}
```

#### 2. オプショナルチェーンを使用

```tsx
// ✅ GOOD
if (session?.role === 'provider') {
  return <Redirect href="/(provider)/(tabs)/today" />;
}

// ❌ BAD
if (session && session.role === 'provider') {
  // session.roleがundefinedの場合、無限ループの可能性
}
```

#### 3. 明確な条件分岐

```tsx
// ✅ GOOD - すべてのケースをカバー
if (session?.role === 'provider') {
  return <Redirect href="/(provider)/(tabs)/today" />;
}

if (session?.role === 'user') {
  return <Redirect href="/(user)/(tabs)/home" />;
}

// セッションなし、または不明なロール
return <SignInScreen />;
```

#### 4. 不要なルートは削除

```tsx
// ❌ BAD - 使われないルートを残す
// app/(onboarding)/role-select.tsx
export default function RoleSelect() {
  return <Redirect href="/" />; // 無限ループの可能性
}

// ✅ GOOD - ルート自体を削除
// rm app/(onboarding)/role-select.tsx
```

## アプリケーションのナビゲーションフロー

### 認証フロー

```
App起動
  ↓
index.tsx (セッション確認)
  ↓
  ├─ セッションなし → /(auth)/sign-in
  │                      ↓
  │                   ログイン成功
  │                      ↓
  ├─ role='provider' → /(provider)/(tabs)/today
  │
  └─ role='user' → /(user)/(tabs)/home
```

### リダイレクトのルール

1. **`index.tsx`**: アプリのエントリーポイント
   - セッション初期化を待つ
   - セッションの有無とロールでリダイレクト先を決定

2. **`(auth)/sign-in.tsx`**: ログイン画面
   - セッションがあればロールに基づいてリダイレクト
   - セッションがなければログインフォームを表示

3. **`(user)/*` と `(provider)/*`**: 認証済みエリア
   - セッションチェックは不要（親layoutで保護）

## デバッグ方法

### 無限ループが発生したら

1. **エラーメッセージを確認**
```
Maximum update depth exceeded
→ リダイレクトループまたはレンダリング中のsetState
```

2. **リダイレクトチェーンを追跡**
```tsx
// 各画面に一時的にログを追加
console.log('[ScreenName] rendering, session:', session);
```

3. **条件をチェック**
```tsx
// すべての条件分岐が正しく終了するか確認
if (condition1) return <Redirect href="/A" />;
if (condition2) return <Redirect href="/B" />;
// ここに到達した場合は何を表示する？
return <DefaultScreen />;
```

## チェックリスト

新しいリダイレクトロジックを追加する前に:

- [ ] セッション/データの初期化を待っているか？
- [ ] すべての条件分岐が明確か？
- [ ] デフォルトケースが定義されているか？
- [ ] 循環リダイレクトの可能性はないか？
- [ ] レンダリング中に`setState`を呼んでいないか？
- [ ] オプショナルチェーン（`?.`）を使っているか？

## まとめ

**無限ループを防ぐ黄金ルール:**
1. 初期化を待つ（`initialized`フラグを使用）
2. 明確な条件分岐（すべてのケースをカバー）
3. 循環参照を避ける（A→B→Aはダメ）
4. レンダリング中の副作用を避ける（`setState`禁止）
