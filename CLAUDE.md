# AI LP Builder

AI パワードのLP制作SaaS。事業主・マーケター向け。

## 作業ルール（最重要）

**IMPORTANT: 以下のルールは必ず守ること。**

### git 操作のルール

- **コミット・プッシュはユーザーの明示的な許可があった場合のみ実行する**
- 「コミットして」「プッシュして」「反映して」等の指示があるまで、git 操作は行わない
- ファイルの変更・作成のみを行い、コミット・プッシュは待つ

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
- variant コンポーネントも同じスタイルルールに従う
- 日本語コメントOK、変数名は英語

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
| 決済 | Stripe |

## データベース（10テーブル）

### アプリケーションテーブル（7テーブル）

- **users**: アカウント、プラン（free/pro/enterprise）
- **projects**: LP プロジェクト（slug で公開 URL 生成）
- **pages**: LP ページ（globalConfig に JSONB でテーマ設定、isPublished で公開/下書きをBoolean管理）
- **sections**: セクションブロック（data に JSONB でコンテンツ + variant、type で 14種を識別）
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

### 設計思想: type × variant × テーマの直交構造

セクションの見た目を決める3つの要素は独立している:

```
type（セクション種別）   → 何を表示するか（Hero, Features, Pricing, ...）
variant（レイアウト）     → どう配置するか（centered, split, grid, alternating, ...）
テーマ（CSS変数）        → どんな色・フォント・テクスチャーで描画するか
```

- **type**: 14種（hero, features, testimonials, pricing, pricing_table, faq, cta, steps, stats, logo_bar, gallery, divider, form, footer）
- **variant**: 各 type に1〜2種。純粋にHTML構造・配置だけが異なる
- **テーマ**: CSS変数でテンプレートごとに定義

### variant と装飾の責任分担

- **variant が担うもの**: HTML構造・要素の配置のみ（2カラム、グリッド、交互配置 等）
- **variant が担わないもの**: グラデーション・影・透明度・色・テクスチャー等の装飾的な見た目

装飾は以下の2つで制御する:
1. **テーマ CSS変数**: テンプレートで定義する全体設定
2. **`styleOverrides`**: セクション単位のCSSオーバーライド。AI チャットで設定する
   - **variant 変更時は自動リセット**: `PATCH /api/sections/[sectionId]` で `data.variant` が変わった場合、`styleOverrides` を `{}` にリセットする（variant とのスタイル競合防止）

### テーマ CSS変数一覧

| 変数 | 用途 | ThemePanel でカスタマイズ |
|------|------|:---:|
| `--accent` | アクセント色（ボタン・リンク等） | ○ |
| `--accent-light` | アクセントの薄い版（バッジ背景・ホバー等） | ○ |
| `--bg` | メイン背景色 | ○ |
| `--bg-secondary` | セクション背景の交互色（Features 等で使用） | ○ |
| `--text` | メイン文字色 | ○ |
| `--font-heading` | 見出しフォント | ✕ |
| `--font-body` | 本文フォント | ✕ |
| `--radius` | 角丸サイズ | ✕ |
| `--texture` | テクスチャー背景画像（SVGデータURI） | ✕ |

### IMPORTANT: セクション・variant コンポーネント作成時の注意

- 子要素に `color: var(--text)` を**直接指定しない**。親 `<section>` からの継承に任せる
- これにより AI チャットが `styleOverrides: { color: '#ff0000' }` を返した場合、セクション全体に反映される
- `color` の直接指定が許される例外:
  - `var(--accent)` を使うアクセント色（チェックマーク、+/- アイコン等）
  - Footer（背景と文字の色関係が逆転: bg=--text, color=--bg）
  - CTA ボタン等の `text-white`（背景色とのコントラスト確保）
  - フォーム入力欄（input/textarea は inherit が効きにくい）

## エラーハンドリング

`src/lib/errors.ts` で一元管理:

- `AppError` クラス（statusCode 付きカスタムエラー）
- ファクトリ関数: `BadRequest()`, `Unauthorized()`, `Forbidden()`, `NotFound()`, `Conflict()`
- `handleApiError()`: 全 API ルートの catch で使用。エラー種別に応じた HTTP ステータスコードを返す
- 開発環境のみ `detail` フィールドでエラー詳細を返却

## バリデーション

`src/lib/validations.ts` で Zod 4 スキーマを一元管理。全 API ルートで `safeParse()` → `formatZodError()` パターンを使用。

## 開発フェーズ

1. **Phase 1**: 基盤（認証・DB・テンプレートエンジン・プレビュー画面）✅
2. **Phase 2**: AI 生成（フォーム＋チャット・セクション編集・画像アップロード）✅
3. **Phase 3**: 公開機能（ホスティング・フォーム受信・ドメイン設定）✅
4. **Phase 4**: 課金・ベータ（Stripe 統合・テスト・バグ修正）✅

## 詳細ドキュメント

以下は必要に応じて参照すること:
- セクション・テンプレート設計の詳細（variant一覧・データ型・追加手順・テンプレート定義）→ `docs/sections-and-templates.md`
- サービス設計（エディターUI・プロジェクト作成フロー・課金・プラン・ドメイン）→ `docs/service-design.md`
