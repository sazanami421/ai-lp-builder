import type { SectionType } from '@/types/section';

// ========================================
// Variant 型定義
// ========================================

/** 各セクション type ごとの variant 識別子 */
export type HeroVariant = 'centered' | 'split';
export type FeaturesVariant = 'grid' | 'alternating';
export type TestimonialsVariant = 'cards' | 'single';
export type PricingVariant = 'cards' | 'table';
export type FaqVariant = 'accordion' | 'two-column';
export type CtaVariant = 'centered' | 'banner';
export type FormVariant = 'simple' | 'split';
export type FooterVariant = 'minimal' | 'columns';

/** SectionType → variant ユニオン型のマッピング */
export type VariantForType = {
  hero: HeroVariant;
  features: FeaturesVariant;
  testimonials: TestimonialsVariant;
  pricing: PricingVariant;
  faq: FaqVariant;
  cta: CtaVariant;
  form: FormVariant;
  footer: FooterVariant;
};

// ========================================
// Variant メタ情報（UI 表示用）
// ========================================

export type VariantMeta = {
  value: string;
  label: string;
  description: string;
};

/**
 * 各セクション type ごとの variant 一覧（UI 表示・EditPanel セレクター用）
 * 将来 EditPanel に variant セレクターを追加する際に使用
 */
export const SECTION_VARIANTS: Record<SectionType, VariantMeta[]> = {
  hero: [
    { value: 'centered', label: '中央配置', description: 'テキスト・CTAを中央に配置' },
    { value: 'split', label: '2カラム', description: '左テキスト＋右画像の2カラム' },
  ],
  features: [
    { value: 'grid', label: 'グリッド', description: 'カード型グリッド（2-3カラム）' },
    { value: 'alternating', label: '左右交互', description: '左右交互レイアウト（画像+テキスト）' },
  ],
  testimonials: [
    { value: 'cards', label: 'カード並び', description: 'カード型で横に並べる' },
    { value: 'single', label: '1件表示', description: '1件ずつ大きく表示' },
  ],
  pricing: [
    { value: 'cards', label: 'カード', description: 'プランカード横並び' },
    { value: 'table', label: '比較表', description: '比較表形式' },
  ],
  faq: [
    { value: 'accordion', label: 'アコーディオン', description: 'アコーディオン縦並び' },
    { value: 'two-column', label: '2カラム', description: '2カラム配置' },
  ],
  cta: [
    { value: 'centered', label: '中央配置', description: '中央に配置' },
    { value: 'banner', label: 'バナー', description: '横長バナー形式' },
  ],
  form: [
    { value: 'simple', label: 'シンプル', description: 'フォームのみ' },
    { value: 'split', label: '2カラム', description: '左テキスト＋右フォーム' },
  ],
  footer: [
    { value: 'minimal', label: 'ミニマル', description: '1行シンプル' },
    { value: 'columns', label: 'カラム', description: '複数カラム' },
  ],
};

// ========================================
// デフォルト variant
// ========================================

/** variant 未指定時のフォールバック値 */
export const DEFAULT_VARIANTS: Record<SectionType, string> = {
  hero: 'centered',
  features: 'grid',
  testimonials: 'cards',
  pricing: 'cards',
  faq: 'accordion',
  cta: 'centered',
  form: 'simple',
  footer: 'minimal',
};

// ========================================
// ヘルパー関数
// ========================================

/**
 * セクションデータから variant を取得（未指定時はデフォルトにフォールバック）
 */
export function getVariant<T extends SectionType>(
  type: T,
  data: Record<string, unknown>
): VariantForType[T] {
  const variant = data?.variant;
  if (typeof variant === 'string') {
    // 有効な variant かチェック
    const validVariants = SECTION_VARIANTS[type].map((v) => v.value);
    if (validVariants.includes(variant)) {
      return variant as VariantForType[T];
    }
  }
  return DEFAULT_VARIANTS[type] as VariantForType[T];
}

/**
 * 指定された variant が有効かどうかをチェック
 */
export function isValidVariant(type: SectionType, variant: string): boolean {
  return SECTION_VARIANTS[type].some((v) => v.value === variant);
}
