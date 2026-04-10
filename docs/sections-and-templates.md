# セクション・テンプレート設計詳細

## セクション種別と variant 一覧

| type | variant | 概要 |
|------|---------|------|
| `hero` | `centered` | テキスト・CTAを中央配置 |
| `hero` | `split` | 左テキスト＋右画像の2カラム |
| `hero` | `fullscreen` | 100vh グラデーション背景・左テキスト＋右装飾 |
| `features` | `grid` | カード型グリッド（2-3カラム・画像はカード上部ヘッダー、object-contain で全体表示） |
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

## セクション共通構造

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

## セクションデータ型（variant は data 内に含む）

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

### Features セクションの画像/アイコン表示ルール

grid / alternating 両 variant 共通:
- `item.image` あり → 画像のみ表示（アイコンは無視）
- `item.image` なし、`item.icon` あり → アイコンのみ表示
- 両方なし → alternating はプレースホルダー SVG、grid はタイトル・説明のみ

grid variant の画像表示: `aspect-video` ラッパー内に `object-contain` で全体表示。余白背景は `var(--bg)`。縦長・横長どちらの画像も切り抜かずに表示される。

### 新規追加セクションのデータ型

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

## スタイル適用の優先順位（CSS カスケード）

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

## グラデーション・装飾の指定方法

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

## セクション種別の追加手順

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

## 既存セクションに variant を追加する手順

1. `src/types/section.ts` のデータ型に `variant?` と variant 固有フィールドを追加
2. `src/lib/variants.ts` の `SECTION_VARIANTS` に variant を登録
3. `src/components/sections/XxxSection.tsx` 内で variant による分岐を実装
4. `src/lib/defaultSectionData.ts` を更新（必要に応じて）
5. 各テンプレートの `defaultVariants` を更新

## セクション・variant 変更時のシンプル化原則

セクションや variant に関わる変更は、**構造を複雑化しない方法を最優先で探すこと**。

```
❌ 避けるべき例: 全セクションコンポーネントに新 prop を追加して SectionRenderer から制御
✅ 望ましい例: 対象セクションの buildSectionStyle の引数を直接変更する（3ファイルの1行変更）
```

- 変更を加える前に「既存の構造の中で解決できないか」を必ず確認する
- 新しい prop・context・動的ロジックを追加する前に、**静的な値（CSS変数の直指定など）で解決できないか**を先に検討する
- 影響ファイルが 5 を超える場合は実装前にユーザーに設計を相談する

## デフォルトデータ

セクション新規追加時、`data` が空オブジェクト `{}` の場合は `SectionRenderer` が `DEFAULT_SECTION_DATA[type]` にフォールバックする。各セクションのデフォルトデータは `src/lib/defaultSectionData.ts` で定義。

---

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
