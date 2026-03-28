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
│   │   │       ├── new/                 # 新規プロジェクト作成（AI生成フロー）
│   │   │       └── submissions/[projectId]/ # フォーム送信一覧
│   │   ├── editor/[pageId]/     # LP エディター
│   │   ├── api/
│   │   │   ├── ai/
│   │   │   │   ├── chat/        # AI チャット編集
│   │   │   │   └── generate/    # AI 一括生成（新規プロジェクト作成用）
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
│   │   │   ├── SectionRenderer.tsx  # type + variant → コンポーネント振り分け
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
│   │   ├── ai.ts                # Claude API ラッパー（generateSectionEdit / generateLP）
│   │   ├── errors.ts            # 共通エラーハンドリング（AppError + handleApiError）
│   │   ├── validations.ts       # Zod バリデーションスキーマ（全APIルート用）
│   │   ├── variants.ts          # variant 定義（型・デフォルト値・メタ情報）
│   │   ├── defaultSectionData.ts # セクション種別ごとのデフォルトデータ
│   │   └── templates/           # テンプレート定義（CSS変数 + デフォルト variant + セクション構成）
│   │       ├── index.ts
│   │       ├── simple.ts
│   │       ├── premium.ts
│   │       ├── pop.ts
│   │       ├── business.ts
│   │       └── natural.ts
│   └── types/
│       ├── section.ts           # セクション型定義（variant 含む）
│       ├── template.ts          # TemplateDefinition 型（循環参照回避のため独立）
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
- **sections**: セクションブロック（data に JSONB でコンテンツ + variant、type で 8種を識別）
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
- **テーマ**: CSS変数（--accent, --accent-light, --bg, --bg-secondary, --text, --font-heading, --font-body, --radius, --texture）

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

### variant と装飾の責任分担

- **variant が担うもの**: HTML構造・要素の配置のみ（2カラム、グリッド、交互配置 等）
- **variant が担わないもの**: グラデーション・影・透明度・色・テクスチャー等の装飾的な見た目

装飾は以下の2つで制御する:
1. **テーマ CSS変数**: テンプレートで定義する全体設定（`--accent`, `--bg`, `--text`, `--texture` 等）
2. **`styleOverrides`**: セクション単位のCSSオーバーライド。AI チャットで設定する
   - **variant 変更時は自動リセット**: `PATCH /api/sections/[sectionId]` で `data.variant` が変わった場合、`styleOverrides` を `{}` にリセットする（variant とのスタイル競合防止）

#### グラデーション・装飾の指定方法

グラデーションや装飾的なスタイルは `styleOverrides` で指定する。AI チャットが以下のように返す:

```json
{
  "data": { "..." },
  "styleOverrides": {
    "background": "linear-gradient(135deg, #667eea, #764ba2)"
  }
}
```

`background` を指定すると `backgroundColor` より優先されるため、CSS変数の `--bg` を上書きする形になる。

### セクション種別と variant 一覧

| type | variant | 概要 |
|------|---------|------|
| `hero` | `centered` | テキスト・CTAを中央配置 |
| `hero` | `split` | 左テキスト＋右画像の2カラム |
| `hero` | `fullscreen` | 100vh グラデーション背景・左テキスト＋右装飾 |
| `features` | `grid` | カード型グリッド（2-3カラム） |
| `features` | `alternating` | 左右交互レイアウト（画像+テキスト） |
| `testimonials` | `cards` | カード型並び |
| `testimonials` | `single` | 1件ずつ大きく表示 |
| `pricing` | `cards` | プランカード横並び |
| `faq` | `accordion` | アコーディオン縦並び |
| `faq` | `two-column` | 2カラム配置 |
| `cta` | `centered` | 中央配置 |
| `cta` | `banner` | 横長バナー形式 |
| `form` | `simple` | フォームのみ |
| `form` | `split` | 左テキスト＋右フォームの2カラム |
| `footer` | `minimal` | 1行シンプル |
| `footer` | `columns` | 複数カラム |
| `pricing_table` | `simple` | テーブル形式の料金比較（◯/×＋テキスト） |
| `steps` | `horizontal` | ステップを横並び表示 |
| `steps` | `vertical` | ステップを縦並び表示 |
| `stats` | `row` | 数値実績を横一列に表示 |
| `stats` | `cards` | 数値実績をカード形式で表示 |
| `logo_bar` | `static` | ロゴを静的グリッド表示 |
| `logo_bar` | `scroll` | ロゴを横スクロール表示 |
| `gallery` | `grid` | 画像をグリッド表示 |
| `gallery` | `masonry` | 画像をメイソンリー（高さ不揃い）表示 |
| `divider` | `gradient` | グラデーション帯 |
| `divider` | `ornament` | 装飾ライン（ドット・ダイヤ等） |

### セクション共通構造

```
Section
├── id: string (CUID)
├── type: SectionType (14種)
├── order: number (表示順)
├── visible: boolean (表示/非表示)
├── data: JSONB (type固有のコンテンツデータ + variant)
│   └── variant: string (レイアウト種別、未指定時はデフォルト)
└── styleOverrides: JSONB (セクション単位のCSSオーバーライド)
```

### セクションデータ型（variant は data 内に含む）

各 section type のデータ型は **variant に関わらず共通**。variant によって使わないフィールドは無視されるだけで、データは保持される。

```typescript
type HeroSectionData = {
  variant?: 'centered' | 'split' | 'fullscreen';
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImage?: string;  // centered で使用
  sideImage?: string;         // split / fullscreen で使用（fullscreen は省略時に装飾表示）
};
```

variant 未指定時は `DEFAULT_VARIANTS[type]` にフォールバック。

#### 新規追加セクションのデータ型

```typescript
// 料金表（テーブル形式）
type PricingTablePlan = {
  name: string;
  price: string;
  period: string;
  values: (string | boolean)[];  // features[] のインデックスに対応（true=◯, false=×, string=テキスト）
  highlighted?: boolean;
  ctaText?: string;
  ctaUrl?: string;
};
type PricingTableSectionData = {
  variant?: 'simple';
  title: string;
  features: string[];           // 行ラベル（「基本機能」「API連携」等）
  plans: PricingTablePlan[];
};

// ステップ（使い方・導入フロー）
type StepItem = {
  title: string;
  description: string;
  icon?: string;                // 絵文字 or 番号
};
type StepsSectionData = {
  variant?: 'horizontal' | 'vertical';
  title: string;
  items: StepItem[];
};

// 数字で見る実績
type StatItem = {
  value: string;                // "98%", "500+", "3分" 等
  label: string;                // "顧客満足度", "導入企業数" 等
};
type StatsSectionData = {
  variant?: 'row' | 'cards';
  title?: string;
  items: StatItem[];
};

// ロゴバー（導入企業・メディア掲載）
type LogoItem = {
  imageUrl: string;
  alt: string;
  url?: string;
};
type LogoBarSectionData = {
  variant?: 'static' | 'scroll';
  title?: string;               // "導入企業300社" 等
  items: LogoItem[];
};

// ギャラリー
type GalleryItem = {
  imageUrl: string;
  caption?: string;
};
type GallerySectionData = {
  variant?: 'grid' | 'masonry';
  title?: string;
  items: GalleryItem[];
};

// ディバイダー（セクション間装飾）
type DividerSectionData = {
  variant?: 'gradient' | 'ornament';
  text?: string;                // 1行テキスト（省略可）
};
```

### スタイル適用の優先順位（CSS カスケード）

```
① テンプレートCSS変数（グローバル）
   └─ .lp-preview { --text: #333; --bg: #fff; --accent: ...; --font-heading: ...; --texture: url(...); }
       ページの globalConfig.cssVars でカスタム上書き可能

② セクションルート <section> の style 属性
   └─ { backgroundColor: 'var(--bg)', color: 'var(--text)', backgroundImage: 'var(--texture)', ...styleOverrides }
       styleOverrides は AI チャットで設定
       テクスチャー無効化: styleOverrides に { backgroundImage: 'none' }
       グラデーション: styleOverrides に { background: 'linear-gradient(...)' }

③ 子要素は CSS の自然な継承で色を受け取る
   └─ <h1>, <p> 等は color を直接指定しない（inherit）
       fontFamily のみ見出し用に var(--font-heading) を指定
       opacity で視覚階層を表現（0.75, 0.7, 0.6 等）
```

**重要ルール（セクション・variant コンポーネント作成時の注意）:**
- 子要素に `color: var(--text)` を**直接指定しない**。親 `<section>` からの継承に任せる
- これにより AI チャットが `styleOverrides: { color: '#ff0000' }` を返した場合、セクション全体に反映される
- `color` の直接指定が許される例外:
  - `var(--accent)` を使うアクセント色（チェックマーク、+/- アイコン等）
  - Footer（背景と文字の色関係が逆転: bg=--text, color=--bg）
  - CTA ボタン等の `text-white`（背景色とのコントラスト確保）
  - フォーム入力欄（input/textarea は inherit が効きにくい）

### セクション種別の追加手順

新しいセクション種別を追加するには:

1. `prisma/schema.prisma` の `SectionType` enum に追加
2. `src/types/section.ts` にデータ型を追加し、`SectionType` と `SectionData` ユニオンに追加
3. `src/components/sections/XxxSection.tsx` を作成（上記スタイルルールに従う）
4. `src/components/sections/SectionRenderer.tsx` に case を追加
5. `src/lib/variants.ts` に variant 定義を追加
6. `src/lib/defaultSectionData.ts` にデフォルトデータを追加
7. `src/components/editor/forms/XxxForm.tsx` を作成（EditPanel 用）
8. `src/components/editor/EditPanel.tsx` に case を追加
9. `src/components/editor/AddSectionModal.tsx` のセクション一覧に追加
10. `src/lib/validations.ts` の `sectionTypeEnum` に追加
11. `npx prisma migrate dev` でマイグレーション

### 既存セクションに variant を追加する手順

1. `src/types/section.ts` のデータ型に `variant?` と variant 固有フィールドを追加
2. `src/lib/variants.ts` の `SECTION_VARIANTS` に variant を登録
3. `src/components/sections/XxxSection.tsx` 内で variant による分岐を実装
4. `src/lib/defaultSectionData.ts` を更新（必要に応じて）
5. 各テンプレートの `defaultVariants` を更新

### デフォルトデータ

セクション新規追加時、`data` が空オブジェクト `{}` の場合は `SectionRenderer` が `DEFAULT_SECTION_DATA[type]` にフォールバックする。各セクションのデフォルトデータは `src/lib/defaultSectionData.ts` で定義。

## テンプレート設計

### テンプレートの役割

テンプレートは **プロジェクトの初期状態を決める完全プリセット**。作成後の変更は不可（カラーカスタマイズを除く）。

テンプレートが定義するもの:
1. **CSS変数のデフォルト値**（色・フォント・角丸・テクスチャー）
2. **各セクションのデフォルト variant**（どの配置をデフォルトにするか）
3. **デフォルトのセクション構成**（どの type をどの順で並べるか）

テンプレート切り替え機能は**廃止**。別のテンプレートを使いたい場合は新規プロジェクトを作成する。
カラーカスタマイズ（ThemePanel）はエディターでいつでも変更可能。

### テンプレート一覧（5種類）

| テンプレート | トーン | --accent | --accent-light | --bg | --bg-secondary | --text | テクスチャー |
|------------|--------|---------|---------------|------|---------------|--------|------------|
| simple | ミニマル | #2B2B28 | #EBEBEA | #FFFFFF | #F7F7F6 | #2B2B28 | なし |
| premium | 高級感（ダーク） | #C6A96C | #2C2415 | #0F0F0F | #191919 | #F5F0E8 | グレイン（高級紙風） |
| pop | カラフル | #FF6B35 | #FFE4D4 | #FFFBF5 | #FFF3E8 | #1A1A1A | ドットパターン |
| business | ビジネス（ブルー） | #1E56A0 | #E3EEF8 | #FFFFFF | #F0F5FB | #1A1A2E | 斜線パターン |
| natural | ナチュラル（グリーン） | #2D8A6E | #C8E8DF | #FAFAF7 | #F2F2EC | #2C3E2D | 和紙風テクスチャー |

| テンプレート | 見出しフォント | 本文フォント |
|------------|--------------|------------|
| simple | Outfit | Outfit |
| premium | Cormorant Garamond | Cormorant Garamond |
| pop | DM Sans | DM Sans |
| business | Plus Jakarta Sans | Plus Jakarta Sans |
| natural | Lora | Raleway |

### テンプレートごとの defaultVariants

```
simple:   hero=centered, features=grid, testimonials=cards, pricing=cards, pricing_table=simple, faq=accordion, cta=centered, steps=horizontal, stats=row, logo_bar=static, gallery=grid, divider=gradient, form=simple, footer=minimal
premium:  hero=split, features=alternating, testimonials=single, pricing=cards, pricing_table=simple, faq=accordion, cta=banner, steps=vertical, stats=cards, logo_bar=scroll, gallery=masonry, divider=ornament, form=split, footer=columns
pop:      hero=centered, features=grid, testimonials=cards, pricing=cards, pricing_table=simple, faq=two-column, cta=centered, steps=horizontal, stats=cards, logo_bar=static, gallery=grid, divider=gradient, form=simple, footer=minimal
business: hero=split, features=alternating, testimonials=cards, pricing=cards, pricing_table=simple, faq=accordion, cta=banner, steps=horizontal, stats=row, logo_bar=scroll, gallery=grid, divider=gradient, form=split, footer=columns
natural:  hero=centered, features=alternating, testimonials=single, pricing=cards, pricing_table=simple, faq=accordion, cta=centered, steps=vertical, stats=row, logo_bar=static, gallery=masonry, divider=gradient, form=simple, footer=minimal
```

### テンプレート定義の構造

```typescript
// src/types/template.ts
type TemplateDefinition = {
  name: string;
  label: string;
  cssVars: Record<string, string>;
  defaultVariants: VariantMap;  // 各 type のデフォルト variant
};
```

- `TemplateDefinition` は `src/types/template.ts` に定義（`src/lib/templates/` からの循環参照を防ぐため独立）
- 各テンプレートは `as const satisfies TemplateDefinition` で型チェック済み
- テンプレートの CSS 変数は `src/lib/templates/` で定義。Preview コンポーネントがテンプレートデフォルト変数とページの `globalConfig.cssVars` をマージして適用する
- CSS クラス `.lp-preview` でプレビューと公開サイトの CSS 変数適用を統一

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
| POST | `/api/ai/generate` | generateLPSchema | 必要 | AI 一括LP生成（新規プロジェクト作成用） |
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
2. **Phase 2**（2-4ヶ月）: AI 生成（フォーム＋チャット・セクション編集・画像アップロード）✅
   - variant システム（type × variant × テーマの直交構造）✅
   - AI 一括LP生成（新規プロジェクト作成フロー）🚧 実装中
3. **Phase 3**（4-5ヶ月）: 公開機能（ホスティング・フォーム受信・ドメイン設定）
4. **Phase 4**（5-6ヶ月）: 課金・ベータ（Stripe 統合・テスト・バグ修正）

## 課金・プラン設計

### プラン一覧

| プラン | AIクレジット | 公開LP数 | ストレージ |
|--------|------------|---------|-----------|
| Free | 月20pt | 2件 | 50MB |
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

### Stripe連携設計（Phase 4）

#### usersテーブルに追加予定のフィールド

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

### 独自ドメイン（Phase 4・Proプラン限定）

**方式：Vercel API方式**（リダイレクトではなくプロキシ）

1. ユーザーがエディターでカスタムドメインを入力
2. DNS設定手順を表示（CNAME: `cname.vercel-app.com`）
3. サーバーが Vercel API でドメインを登録
4. Vercel が DNS確認・SSL証明書を自動発行
5. Next.js middleware が `Host` ヘッダーを見て対応するLPをレンダリング

pagesテーブルに追加予定:
```prisma
customDomain    String?   @unique  // "example.com"
domainVerified  Boolean   @default(false)
```

### 将来検討項目

- 管理画面（/admin）: ユーザー一覧・プラン手動変更・クレジット手動付与（ユーザーが増えてから）
- 電話番号認証（2FA）: Phase 4以降、セキュリティ強化として
- 画像アップロード容量のFree/Pro表示はアカウントアイコンメニューに実装済み

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

### git 操作のルール

- **コミット・プッシュはユーザーの明示的な許可があった場合のみ実行する**
- 「コミットして」「プッシュして」「反映して」等の指示があるまで、git 操作は行わない
- ファイルの変更・作成のみを行い、コミット・プッシュは待つ

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
