# サービス設計詳細

## エディター UI

3パネル構成:

```
┌────────────┬──────────────┬──────────────────────────────┐
│ 左パネル    │ 中央パネル    │ 右パネル                      │
│ (w-64)     │ (w-80)       │ (flex-1)                     │
│            │              │                              │
│ ThemePanel │ EditPanel    │ Preview                      │
│ テーマ色    │ 選択セクション │ リアルタイムプレビュー          │
│ カスタマイズ │ の詳細編集    │ Desktop/Mobile 切替           │
│            │ フォーム      │ 公開ステータス管理              │
│ SectionList│              │                              │
│ セクション  │              │ ┌─────────────────────────┐  │
│ 一覧       │              │ │  AIChatWindow           │  │
│ ドラッグ    │              │ │  フローティング            │  │
│ 並び替え    │              │ │  AIチャット               │  │
│            │              │ └─────────────────────────┘  │
└────────────┴──────────────┴──────────────────────────────┘
```

- **左パネル**: テーマ色のカスタマイズ + セクション一覧（ドラッグ並び替え・表示/非表示切替・削除）
- **中央パネル**: 選択中セクションの編集フォーム（テキスト・画像・項目の追加削除）。将来的に variant セレクターを追加予定
- **右パネル**: リアルタイムプレビュー + 公開ステータス管理 + 更新を公開ボタン
- **フローティングチャット**: 右パネル内の右下ボタンで開閉、選択中セクションに対してのみAI指示
- **テンプレート選択**: エディター内では不可。プロジェクト作成時に確定

### AI チャットフロー

1. ユーザーがセクションを選択し、チャットで指示を入力
2. AI（Claude）が `data`（variant 含む）+ `styleOverrides` の完全な JSON を返す
3. プレビューに「プレビュー中」バッジ付きで即座に反映
4. 「適用する」ボタンで DB に保存、「元に戻す」で破棄

AI は variant を自由に変更できる。「レイアウトを変えて」「左右交互にして」等の指示で variant を切り替える。
グラデーション・影・透明度等の装飾は `styleOverrides` で返す（例: `{ "background": "linear-gradient(...)" }`）。

### セクション追加フロー

1. AddSectionModal で section type のみ選択（variant は選ばない）
2. テンプレートの `defaultVariants[type]` で variant が決定
3. 追加後、AI チャットで variant 変更可能

---

## 新規プロジェクト作成フロー

`/dashboard/new` ページで3パターンから選択する。

```
「新規プロジェクト作成」クリック
  ↓
/dashboard/new
  ↓
[Step 0] 作成方法を選ぶ
  ├─ ① AIにおまかせ
  │     ↓
  │   [Step 1] テンプレート選択（5種）
  │     ↓
  │   [Step 2-4] ヒアリング（業種/ターゲット/強み/機能×3/料金プラン数/CTA）
  │     ↓
  │   [Step 5] プロジェクト名入力
  │     ↓
  │   POST /api/ai/generate → 生成中スピナー → エディター
  │
  └─ ② 手動
        プロジェクト名入力 → エディター（空）
```

### ヒアリング項目

| # | 質問 | 形式 |
|---|------|------|
| 1 | テンプレート | 選択（5種） |
| 2 | 業種・カテゴリ | 選択（SaaS/EC/士業/飲食/医療・美容/その他） |
| 3 | ターゲット | 選択（個人向け/中小企業向け/大企業向け/幅広く） |
| 4 | 一番の強み・USP | テキスト（1〜2行） |
| 5 | 主な特徴・機能（3つ） | テキスト × 3 |
| 6 | 料金プランの数 | 選択（なし/1/2/3） |
| 7 | CTAのゴール | 選択（無料登録/資料請求/購入/お問い合わせ） |
| 8 | プロジェクト名 | テキスト（最後に入力） |

### AI 一括生成の仕様

- エンドポイント: `POST /api/ai/generate`
- 課金プラン機能（Pro 以上で利用可能予定）
- 1リクエストで全セクション分のコンテンツを生成（hero/features/testimonials/pricing/faq/cta/form/footer）
- 生成後はプロジェクト・ページ・セクションを DB に一括 INSERT してエディターへリダイレクト
- UX: 生成中はシンプルなローディングスピナーを表示

---

## 課金・プラン設計

### プラン一覧

| プラン | AIクレジット | 公開LP数 | ストレージ |
|--------|------------|---------|-----------|
| Free | 月25pt | 1件 | 15MB |
| Pro | 無制限 | 無制限 | 無制限（Supabase側で制御） |

### AIクレジット仕様

- **消費単位**: AI一括生成 = 3pt / AIチャット編集 = 1pt
- **リセットタイミング**: カレンダー月をまたいだ**初回AI利用時**にリセット（cronなし）
- **繰り越しなし**: 未使用クレジットは翌月に持ち越されない
- **管理フィールド**: `users.aiCreditsUsed`（使用量）、`users.aiCreditsResetAt`（最終リセット日時）
- **上限超過時**: HTTP 402 を返し、UIでアップグレードCTAを表示

### Freeプラン制限の実装方針

- **AIクレジット超過**: `consumeAICredits()` で事前チェック → 超過時は 402
- **公開LP超過**: `PATCH /api/pages/[pageId]` で `isPublished: true` 時にチェック → 超過時は 402
- **ストレージ超過**: `POST /api/upload` で事前チェック → 超過時は 402
- これらのロジックは `src/lib/plans.ts` に集約（`PLAN_LIMITS` 定数を変えるだけで全APIに反映）

### プラン降格時の公開LP扱い

- `isPublished` は変更しない（降格時に自動で下書きに戻さない）
- `/p/[slug]` レンダリング時にユーザーの公開LP数 > 上限であれば**一律閲覧不可**（専用画面を表示）
- エディターに「公開LP数が上限を超えています」警告を表示
- ユーザーが手動で2件以下に減らすと全LP復活

### Stripe連携設計

#### usersテーブルのStripe関連フィールド

```prisma
stripeCustomerId     String?   @unique  // cus_xxx（Stripe API呼び出しに必須）
stripeSubscriptionId String?   @unique  // sub_xxx（サブスク管理）
subscriptionStatus   String?            // active / past_due / canceled / trialing
currentPeriodEnd     DateTime?          // 請求期間終了日（UIに「〇月〇日まで有効」表示）
cancelAtPeriodEnd    Boolean   @default(false) // 自動更新OFF（解約予約中）フラグ
```

#### `plan` フィールドとの役割分担

- `plan` → 機能ゲーティングの唯一の判定軸（ここだけ見ればFree/Proがわかる）
- `subscriptionStatus` → Stripe側の詳細状態（支払い失敗 `past_due` 等の対応）
- Webhook受信時に両方を更新する

#### 自動課金フロー

```
Pro契約 → Stripe自動課金ON（cancelAtPeriodEnd = false）
自動課金OFF操作 → cancelAtPeriodEnd = true（期間終了まではProのまま）
期間終了 → Stripe Webhook（customer.subscription.deleted）→ plan = free に降格
```

#### Free→Pro アップグレード時

- `aiCreditsUsed = 0` にリセット（使い切った直後にアップグレードしたユーザーへの配慮）

### 独自ドメイン（Proプラン限定）

**方式：Vercel API方式**（リダイレクトではなくプロキシ）

1. ユーザーがエディターでカスタムドメインを入力
2. DNS設定手順を表示（CNAME: `cname.vercel-app.com`）
3. サーバーが Vercel API でドメインを登録
4. Vercel が DNS確認・SSL証明書を自動発行
5. Next.js middleware が `Host` ヘッダーを見て対応するLPをレンダリング

pagesテーブルのドメイン関連フィールド:
```prisma
customDomain    String?   @unique  // "example.com"
domainVerified  Boolean   @default(false)
```

### 将来検討項目

- 管理画面（/admin）: ユーザー一覧・プラン手動変更・クレジット手動付与（ユーザーが増えてから）
- 電話番号認証（2FA）: Phase 4以降、セキュリティ強化として
- 画像アップロード容量のFree/Pro表示はアカウントアイコンメニューに実装済み
