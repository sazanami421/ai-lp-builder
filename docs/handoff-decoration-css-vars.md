# 指示書: 装飾CSS変数の追加（テンプレート差別化）

## 目的

5つのテンプレートが色・フォント以外ほぼ同じ見た目になっている問題を解決する。
装飾系のCSS変数を7個追加し、テンプレートごとの「触感・性格」を明確に差別化する。

## デザイン方針（UI/UX Pro Max スキル準拠）

各テンプレートのデザインスタイルは以下に基づく:

| テンプレート | デザインスタイル | キーワード |
|--|--|--|
| simple | Social Proof / Minimal | フラット、影なし、細線、クリーン |
| premium | Liquid Glass | 深い影、ボーダーなし、浮遊感、高級 |
| pop | **Neubrutalism** | 太黒枠、45°黒影、角丸なし、大胆 |
| business | Trust & Authority | 控えめ影、構造線、きっちり、信頼 |
| natural | Calm Wellness | 柔らかい影、薄い線、丸い、オーガニック |

## 追加するCSS変数（7個）

### 一覧

| # | 変数名 | 用途 | 適用先 |
|---|--------|------|--------|
| 1 | `--card-shadow` | カードの影 | Features, Pricing, Testimonials, Stats, PricingTable 等のカード要素 |
| 2 | `--card-border` | カードのボーダー | 同上 |
| 3 | `--button-shadow` | CTAボタンの影 | Hero, CTA, Pricing, Form のボタン |
| 4 | `--button-radius` | ボタンの角丸 | 同上（`--radius` はカード用、これはボタン専用） |
| 5 | `--heading-accent` | 見出し下の装飾線 | 各セクションのタイトル `::after` |
| 6 | `--section-divider` | セクション間の境界線 | セクションルート `<section>` の `border-bottom` |
| 7 | `--hover-lift` | ホバー時の浮き上がり量 | カード・ボタンの `translateY` |

### テンプレートごとの値

#### 1. `--card-shadow`
```
simple:   none
premium:  0 8px 32px rgba(0,0,0,0.25)
pop:      4px 4px 0 #000000
business: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)
natural:  0 4px 20px rgba(0,0,0,0.05)
```

#### 2. `--card-border`
```
simple:   1px solid rgba(0,0,0,0.08)
premium:  none
pop:      3px solid #000000
business: 1px solid rgba(0,0,0,0.12)
natural:  1px solid rgba(0,0,0,0.06)
```

#### 3. `--button-shadow`
```
simple:   none
premium:  0 4px 16px rgba(0,0,0,0.3)
pop:      4px 4px 0 #000000
business: 0 1px 2px rgba(0,0,0,0.1)
natural:  none
```

#### 4. `--button-radius`
```
simple:   6px
premium:  0px
pop:      0px
business: 8px
natural:  9999px
```

#### 5. `--heading-accent`
```
simple:   none
premium:  2px solid var(--accent)
pop:      4px solid #000000
business: 2px solid var(--accent)
natural:  none
```

#### 6. `--section-divider`
```
simple:   none
premium:  none
pop:      none
business: 1px solid rgba(0,0,0,0.06)
natural:  none
```

#### 7. `--hover-lift`
```
simple:   0
premium:  -4px
pop:      -6px
business: -2px
natural:  -2px
```

## 実装手順（1ステップずつ確認を取ること）

### Step 1: テンプレート定義にCSS変数を追加

**対象ファイル:**
- `src/lib/templates/simple.ts`
- `src/lib/templates/premium.ts`
- `src/lib/templates/pop.ts`
- `src/lib/templates/business.ts`
- `src/lib/templates/natural.ts`

各テンプレートの `cssVars` に上記7変数を追加する。

```typescript
// 例: simple.ts
cssVars: {
  // ... 既存の変数
  '--card-shadow': 'none',
  '--card-border': '1px solid rgba(0,0,0,0.08)',
  '--button-shadow': 'none',
  '--button-radius': '6px',
  '--heading-accent': 'none',
  '--section-divider': 'none',
  '--hover-lift': '0',
},
```

**確認ポイント:** テンプレート5つ全てにCSS変数が追加されているか。型エラーがないか。

### Step 2: カード要素に `--card-shadow` と `--card-border` を適用

**対象ファイル:**
- `src/components/sections/FeaturesSection.tsx`（カード）
- `src/components/sections/PricingSection.tsx`（プランカード）
- `src/components/sections/TestimonialsSection.tsx`（カード variant）
- `src/components/sections/StatsSection.tsx`（cards variant）
- `src/components/sections/PricingTableSection.tsx`（テーブルコンテナ）

カード要素の既存の `shadow-*` Tailwind クラスと `border-*` クラスを CSS変数に置き換える。

```tsx
// 変更前（例）
<div className="rounded-lg shadow-sm border border-gray-100 ...">

// 変更後
<div
  className="..."
  style={{
    boxShadow: 'var(--card-shadow)',
    border: 'var(--card-border)',
    borderRadius: 'var(--radius)',
  }}
>
```

**注意:**
- Tailwind の `shadow-*` と `border-*` クラスは削除する（CSS変数と競合するため）
- `borderRadius` は既存の `--radius` を使う（新規変数ではない）
- `rounded-lg` 等の Tailwind 角丸クラスも `var(--radius)` に統一する

**確認ポイント:** 5つのテンプレートそれぞれでカードの見た目が異なるか。特にPopのNeubrutalism影が正しく出ているか。

### Step 3: ボタンに `--button-shadow` と `--button-radius` を適用

**対象ファイル:**
- `src/components/sections/HeroSection.tsx`（CTAボタン）
- `src/components/sections/CtaSection.tsx`（CTAボタン）
- `src/components/sections/PricingSection.tsx`（プランCTAボタン）
- `src/components/sections/FormSection.tsx`（送信ボタン）
- `src/components/sections/PricingTableSection.tsx`（プランCTAボタン）

```tsx
// 変更前
<a className="rounded-lg px-8 py-3 ..." style={{ backgroundColor: 'var(--accent)' }}>

// 変更後
<a
  className="px-8 py-3 ..."
  style={{
    backgroundColor: 'var(--accent)',
    boxShadow: 'var(--button-shadow)',
    borderRadius: 'var(--button-radius)',
  }}
>
```

**注意:**
- ボタンの `rounded-*` Tailwind クラスは削除して `var(--button-radius)` に置き換え
- `--button-radius` と `--radius`（カード用）は別の値

**確認ポイント:** Premium（シャープ）、Pop（シャープ+黒影）、Natural（完全丸ボタン）で見た目が明確に異なるか。

### Step 4: 見出しに `--heading-accent` を適用

**対象ファイル:**
- 各セクションコンポーネントのタイトル要素

セクションタイトル（`<h2>` 等）に `::after` 疑似要素で下線装飾を追加する。
CSS変数を疑似要素に適用するため、グローバルCSSまたはインラインではなく Tailwind の `@layer` を使う。

**方法A: グローバルCSS（推奨）**

```css
/* globals.css 等に追加 */
.section-heading::after {
  content: '';
  display: block;
  width: 48px;
  margin-top: 12px;
  border-bottom: var(--heading-accent);
}

/* none の場合は表示しない */
.section-heading[data-accent="none"]::after {
  display: none;
}
```

**方法B: インラインで `<div>` を追加**

`--heading-accent` が `none` でない場合のみ、タイトル下に装飾 `<div>` を追加する方法。
疑似要素より簡潔で、CSS変数との相性が良い。

```tsx
{/* タイトル下に装飾線 */}
<div
  className="mt-3 w-12"
  style={{ borderBottom: 'var(--heading-accent)' }}
/>
```

**注意:** `none` の場合、`border-bottom: none` となり何も表示されないので条件分岐不要。

**確認ポイント:** Premium（ゴールド細線）、Pop（太黒線）、Business（ブルー細線）で装飾が出ているか。Simple/Natural で何も出ないか。

### Step 5: セクション境界に `--section-divider` を適用

**対象ファイル:**
- `src/lib/sectionStyle.ts`（`buildSectionStyle` 関数）
  または各セクションコンポーネントの `<section>` 要素

各セクションの `<section>` に `border-bottom` を追加。

```typescript
// buildSectionStyle に追加
borderBottom: 'var(--section-divider)',
```

**注意:**
- 最後のセクション（Footer）には適用しない方が良い場合がある
- `none` の場合は何も表示されない

**確認ポイント:** Pop（太黒破線）、Business（薄い水平線）でセクション間に境界が見えるか。

### Step 6: ホバーエフェクトに `--hover-lift` を適用

**対象ファイル:**
- Step 2 で変更したカード要素
- Step 3 で変更したボタン要素

Tailwind のクラスではCSS変数を直接使えないため、グローバルCSS で対応する:

```css
/* globals.css */
.hover-lift {
  transition: transform 200ms ease;
}
.hover-lift:hover {
  transform: translateY(var(--hover-lift));
}

/* prefers-reduced-motion 対応（必須） */
@media (prefers-reduced-motion: reduce) {
  .hover-lift:hover {
    transform: none;
  }
}
```

**確認ポイント:** カードをホバーした時の浮き上がりがテンプレートごとに異なるか。`prefers-reduced-motion` で動かないか。

### Step 7: CLAUDE.md を更新

**対象ファイル:** `CLAUDE.md`

以下を更新:
1. テーマCSS変数一覧テーブルに7変数を追加
2. テンプレート一覧テーブルに各テンプレートの装飾スタイル名を追加
3. ThemePanelでカスタマイズ可能かの列を追加（装飾変数は全て ✕ でOK）

## 重要な注意事項

### コーディングルール
- 子要素に `color` を直接指定しない（inherit で親から継承）ルールは引き続き遵守
- `styleOverrides` との競合に注意: `styleOverrides` に `boxShadow` や `border` が入る可能性がある。`styleOverrides` は CSS変数より後に適用されるため、AIチャットからのオーバーライドは正しく動作するはず
- Tailwind のユーティリティクラスと CSS変数の置き換えでは、同じプロパティを二重指定しないこと

### 作業ルール
- **1ステップずつ実装し、確認を取ってから次に進む**
- 全ステップを一括実装しない
- 不明点があれば実装前に質問する

### ThemePanel での公開について
- 装飾CSS変数は**ThemePanel でのカスタマイズ対象外**（テンプレートで固定）
- 将来的にカスタマイズ対応する可能性はあるが、今回は対象外
