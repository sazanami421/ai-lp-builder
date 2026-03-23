# AI LP Builder

AI パワードのLP制作SaaS。事業主・マーケター向け。

## プロジェクト概要

- **何をするサービスか**: チャット＋フォームでAIに指示→LPを自動生成→セクション単位でプレビューしながら編集→ホスティングして公開
- **ターゲット**: 事業主・マーケター（非エンジニア）
- **ビジネスモデル**: SaaS 月額課金、ホスティング込み

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router, Turbopack) |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS 4 |
| DB | Supabase (PostgreSQL) + Prisma 7 ORM |
| 画像ストレージ | Supabase Storage |
| 認証 | NextAuth.js v4 |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| バリデーション | Zod 4 |
| ホスティング | Vercel |
| 決済 | Stripe（Phase 4で実装） |

## ディレクトリ構成

```
ai-lp-builder/
├── prisma/
│   └── schema.prisma            # DB スキーマ
├── prisma.config.ts             # Prisma 接続設定（dotenv で .env.local 読み込み）
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # 認証ページ
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/         # ダッシュボード
│   │   │   └── dashboard/
│   │   │       ├── page.tsx             # プロジェクト一覧
│   │   │       └── submissions/[projectId]/ # フォーム送信一覧
│   │   ├── editor/[pageId]/     # LP エディター
│   │   ├── api/
│   │   │   ├── ai/              # AI 一括生成（未実装）
│   │   │   │   └── chat/        # AI チャット編集
│   │   │   ├── auth/            # NextAuth + ユーザー登録
│   │   │   ├── sections/        # セクション CRUD + 並び替え
│   │   │   ├── pages/           # ページ CRUD + 公開
│   │   │   ├── projects/        # プロジェクト作成
│   │   │   ├── upload/          # 画像アップロード
│   │   │   └── form/            # 公開LPフォーム受信
│   │   └── p/[slug]/            # 公開 LP レンダリング（SSR）
│   ├── components/
│   │   ├── editor/              # エディター UI
│   │   │   ├── EditorShell.tsx      # エディター全体レイアウト（3パネル）
│   │   │   ├── SectionList.tsx      # セクション一覧（ドラッグ並び替え）
│   │   │   ├── EditPanel.tsx        # 選択中セクションの編集フォーム
│   │   │   ├── Preview.tsx          # リアルタイムプレビュー
│   │   │   ├── AIChatWindow.tsx     # フローティングAIチャット
│   │   │   ├── ThemePanel.tsx       # テーマ色カスタマイズ
│   │   │   ├── AddSectionModal.tsx  # セクション追加モーダル
│   │   │   └── forms/              # セクション種別ごとの編集フォーム
│   │   │       ├── HeroForm.tsx
│   │   │       ├── FeaturesForm.tsx
│   │   │       ├── CtaForm.tsx
│   │   │       └── ...（各セクション type に対応）
│   │   ├── sections/            # セクションレンダラー
│   │   │   ├── SectionRenderer.tsx  # type → コンポーネント振り分け
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── PricingSection.tsx
│   │   │   ├── FaqSection.tsx
│   │   │   ├── CtaSection.tsx
│   │   │   ├── FormSection.tsx      # 公開LP用フォーム（送信機能付き）
│   │   │   └── FooterSection.tsx
│   │   ├── dashboard/           # ダッシュボード UI
│   │   │   ├── CreateProjectModal.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   └── SiteThumbnail.tsx
│   │   └── providers/
│   │       └── SessionProvider.tsx  # NextAuth セッションプロバイダー
│   ├── lib/
│   │   ├── prisma.ts            # Prisma クライアント（pg アダプタ経由）
│   │   ├── supabase.ts          # Supabase クライアント
│   │   ├── auth.ts              # NextAuth 設定（Google OAuth + Credentials）
│   │   ├── ai.ts                # Claude API ラッパー
│   │   ├── errors.ts            # 共通エラーハンドリング（AppError + handleApiError）
│   │   ├── validations.ts       # Zod バリデーションスキーマ（全APIルート用）
│   │   ├── defaultSectionData.ts # セクション種別ごとのデフォルトデータ
│   │   └── templates/           # テンプレート CSS 変数定義
│   │       ├── index.ts
│   │       ├── simple.ts
│   │       ├── premium.ts
│   │       ├── pop.ts
│   │       └── business.ts
│   └── types/
│       ├── section.ts           # セクション型定義
│       └── next-auth.d.ts       # NextAuth 型拡張
├── ai_lp_builder_concept_v7.docx  # プロダクト構想書
├── CLAUDE.md                    # このファイル
├── .env.local                   # 環境変数（Git管理外）
└── package.json
```

## データベース（10テーブル）

### アプリケーションテーブル（7テーブル）

- **users**: アカウント、プラン（free/pro/enterprise）
- **projects**: LP プロジェクト（slug で公開 URL 生成）
- **pages**: LP ページ（globalConfig に JSONB でテーマ設定、isPublished で公開/下書きをBoolean管理）
- **sections**: セクションブロック（data に JSONB でコンテンツ、type で 8種を識別）
- **section_history**: 変更履歴（dataBefore/dataAfter で Undo 実現、changeSource で manual/ai_chat 識別）
- **form_submissions**: 公開 LP からのフォーム送信
- **assets**: ユーザーアップロード画像

### NextAuth テーブル（3テーブル）

- **accounts**: OAuth 連携アカウント
- **sessions**: セッション管理
- **verification_tokens**: メール認証トークン

### 公開ステータス管理

- 公開状態は `pages.isPublished`（Boolean）で管理。`projects.status` は持たない
- エディターのツールバーにドロップダウン:「下書き」/「公開中」
- 「公開中」→ `isPublished = true`, `publishedAt = now()`
- 「下書き」に戻す → `isPublished = false`（`publishedAt` はリセットしない）
- 公開LP（`/p/[slug]`）は `isPublished = true` のみ表示、false なら 404

### 公開フロー（SSR + キャッシュ再検証方式）

静的ファイル書き出しではなく、Next.js の SSR + `revalidatePath()` で実現している。

1. **エディターで編集** → `sections.data` がDB上で更新される（デバウンス付き自動保存）
2. **「更新を公開」ボタン** → `/api/pages/[pageId]/publish` が `publishedAt` を更新 + `revalidatePath()` でキャッシュ無効化
3. **公開LP（`/p/[slug]`）** → サーバーコンポーネントが DB から最新データを取得して SSR（Next.js キャッシュにより高速）
4. **「下書き」に戻す** → `isPublished = false`、`/p/[slug]` は 404

## セクション設計

### セクション種別（8種）

| type | コンポーネント | データ型 | 概要 |
|------|-------------|---------|------|
| `hero` | HeroSection | HeroSectionData | ヒーロー画像・見出し・CTA |
| `features` | FeaturesSection | FeaturesSectionData | 特徴一覧（アイコン+テキスト） |
| `testimonials` | TestimonialsSection | TestimonialsSectionData | お客様の声（アバター付き） |
| `pricing` | PricingSection | PricingSectionData | 料金プラン比較 |
| `faq` | FaqSection | FaqSectionData | よくある質問（アコーディオン） |
| `cta` | CtaSection | CtaSectionData | CTA（見出し+ボタン） |
| `form` | FormSection | FormSectionData | お問い合わせフォーム（送信機能付き） |
| `footer` | FooterSection | FooterSectionData | フッター（ロゴ+リンク+コピーライト） |

### セクション共通構造

```
Section
├── id: string (UUID)
├── type: SectionType (上記8種)
├── order: number (表示順)
├── visible: boolean (表示/非表示)
├── data: JSONB (type固有のコンテンツデータ)
└── styleOverrides: JSONB (セクション単位のCSSオーバーライド)
```

### スタイル適用の優先順位（CSS カスケード）

```
① テンプレートCSS変数（グローバル）
   └─ .lp-preview { --text: #333; --bg: #fff; --accent: ...; --font-heading: ...; }
       ページの globalConfig.cssVars でカスタム上書き可能

② セクションルート <section> の style 属性
   └─ { backgroundColor: 'var(--bg)', color: 'var(--text)', ...styleOverrides }
       styleOverrides は AI チャットや手動編集で設定

③ 子要素は CSS の自然な継承で色を受け取る
   └─ <h1>, <p> 等は color を直接指定しない（inherit）
       fontFamily のみ見出し用に var(--font-heading) を指定
       opacity で視覚階層を表現（0.75, 0.7, 0.6 等）
```

**重要ルール（セクション追加時の注意）:**
- 子要素に `color: var(--text)` を**直接指定しない**。親 `<section>` からの継承に任せる
- これにより AI チャットが `styleOverrides: { color: '#ff0000' }` を返した場合、セクション全体に反映される
- `color` の直接指定が許される例外:
  - `var(--accent)` を使うアクセント色（チェックマーク、+/- アイコン等）
  - Footer（背景と文字の色関係が逆転: bg=--text, color=--bg）
  - CTA ボタン等の `text-white`（背景色とのコントラスト確保）
  - フォーム入力欄（input/textarea は inherit が効きにくい）

### セクション追加手順

新しいセクション種別を追加するには:

1. `prisma/schema.prisma` の `SectionType` enum に追加
2. `src/types/section.ts` にデータ型を追加し、`SectionType` と `SectionData` ユニオンに追加
3. `src/components/sections/XxxSection.tsx` を作成（上記スタイルルールに従う）
4. `src/components/sections/SectionRenderer.tsx` に case を追加
5. `src/lib/defaultSectionData.ts` にデフォルトデータを追加
6. `src/components/editor/forms/XxxForm.tsx` を作成（EditPanel 用）
7. `src/components/editor/EditPanel.tsx` に case を追加
8. `src/components/editor/AddSectionModal.tsx` のセクション一覧に追加
9. `src/lib/validations.ts` の `sectionTypeEnum` に追加
10. `npx prisma migrate dev` でマイグレーション

### デフォルトデータ

セクション新規追加時、`data` が空オブジェクト `{}` の場合は `SectionRenderer` が `DEFAULT_SECTION_DATA[type]` にフォールバックする。各セクションのデフォルトデータは `src/lib/defaultSectionData.ts` で定義。

## テンプレート（4種類）

| テンプレート | トーン | アクセント色 | フォント |
|------------|--------|------------|---------|
| simple | ミニマル | #2B2B28 | Outfit |
| premium | 高級感（ダーク） | #C6A96C | Cormorant Garamond |
| pop | カラフル | #FF6B35 | DM Sans |
| business | ビジネス（ブルー） | #1E56A0 | Plus Jakarta Sans |

テンプレートの CSS 変数は `src/lib/templates/` で定義。Preview コンポーネントがテンプレートデフォルト変数とページの `globalConfig.cssVars` をマージして適用する。

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
- **中央パネル**: 選択中セクションの編集フォーム（テキスト・画像・項目の追加削除）
- **右パネル**: リアルタイムプレビュー + 公開ステータス管理 + 更新を公開ボタン
- **フローティングチャット**: 右パネル内の右下ボタンで開閉、選択中セクションに対してのみAI指示

### AI チャットフロー（現在の実装）

1. ユーザーがセクションを選択し、チャットで指示を入力
2. AI（Claude）が `data` + `styleOverrides` の完全な JSON を返す
3. プレビューに「プレビュー中」バッジ付きで即座に反映
4. 「適用する」ボタンで DB に保存、「元に戻す」で破棄

## API ルート一覧

| メソッド | パス | バリデーション | 認証 | 概要 |
|---------|------|-------------|------|------|
| POST | `/api/auth/register` | registerSchema | 不要 | ユーザー登録 |
| POST | `/api/projects` | createProjectSchema | 必要 | プロジェクト作成 |
| POST | `/api/sections` | createSectionSchema | 必要 | セクション追加 |
| PATCH | `/api/sections/[sectionId]` | updateSectionSchema | 必要 | セクション更新 |
| DELETE | `/api/sections/[sectionId]` | — | 必要 | セクション削除 |
| POST | `/api/sections/reorder` | reorderSchema | 必要 | セクション並び替え |
| PATCH | `/api/pages/[pageId]` | updatePageSchema | 必要 | ページ更新（公開状態含む） |
| DELETE | `/api/pages/[pageId]` | — | 必要 | ページ削除 |
| POST | `/api/pages/[pageId]/publish` | — | 必要 | 更新を公開（revalidate） |
| POST | `/api/ai/chat` | aiChatSchema | 必要 | AI セクション編集 |
| POST | `/api/upload` | FormData | 必要 | 画像アップロード |
| POST | `/api/form` | formSubmissionSchema | 不要 | 公開LPフォーム受信 |

全 API ルートは `handleApiError()` による共通エラーハンドリングを使用。Prisma エラー（P2002/P2025/P2003）も適切なステータスコードに変換される。

## エラーハンドリング

`src/lib/errors.ts` で一元管理:

- `AppError` クラス（statusCode 付きカスタムエラー）
- ファクトリ関数: `BadRequest()`, `Unauthorized()`, `Forbidden()`, `NotFound()`, `Conflict()`
- `handleApiError()`: 全 API ルートの catch で使用。エラー種別に応じた HTTP ステータスコードを返す
- 開発環境のみ `detail` フィールドでエラー詳細を返却

## バリデーション

`src/lib/validations.ts` で Zod 4 スキーマを一元管理。全 API ルートで `safeParse()` → `formatZodError()` パターンを使用。

## 開発フェーズ

1. **Phase 1**（1-2ヶ月）: 基盤（認証・DB・テンプレートエンジン・プレビュー画面）✅
2. **Phase 2**（2-4ヶ月）: AI 生成（フォーム＋チャット・セクション編集・画像アップロード）✅（一括生成は未実装）
3. **Phase 3**（4-5ヶ月）: 公開機能（ホスティング・フォーム受信・ドメイン設定）
4. **Phase 4**（5-6ヶ月）: 課金・ベータ（Stripe 統合・テスト・バグ修正）

## 作業ルール（最重要）

**以下のルールは必ず守ること。**

### 小さく実装・こまめに確認

- **1つの機能・1つの変更単位で区切って実装する**。複数の機能をまとめて一気に実装しない
- 実装したら**必ずユーザーに確認を取ってから次に進む**。動作確認・プレビュー確認のタイミングをユーザーに委ねる
- 大きなタスクは最初にステップ分解を提示し、**ステップごとに承認を得てから着手**する
- ファイルの変更が 3〜4 ファイルを超える場合は特に注意。途中で確認ポイントを設ける

### 実装順序の例

```
❌ 悪い例: variant 16種 + テクスチャー + AI連携 + API変更を一括実装
✅ 良い例:
  1. HeroSection の variant 実装 → 確認
  2. FeaturesSection の variant 実装 → 確認
  3. テクスチャー CSS 変数追加 → 確認
  4. AI プロンプト更新 → 確認
  5. API 変更 → 確認
```

### 勝手に判断しない

- 設計判断が必要な場面では**必ず選択肢を提示して確認を取る**
- 「こうした方がいいだろう」で進めない。ユーザーの意図を確認する
- 不明点があれば実装前に質問する

## コーディング規約

- TypeScript strict mode
- コンポーネントは関数コンポーネント + hooks
- API Routes は Next.js App Router の Route Handlers
- DB アクセスは必ず Prisma 経由
- エラーハンドリングは `handleApiError()` + `AppError` ファクトリ関数
- バリデーションは Zod スキーマ（`src/lib/validations.ts` に集約）
- セクションコンポーネントの子要素で `color` を直接指定しない（inherit で親から継承）
- 日本語コメントOK、変数名は英語
