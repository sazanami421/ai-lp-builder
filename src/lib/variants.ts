import { SectionType } from '@/types/section';

// --- variant 型定義 ---

export type HeroVariant       = 'centered' | 'split' | 'fullscreen';
export type FeaturesVariant   = 'grid' | 'alternating';
export type TestimonialsVariant = 'cards' | 'single';
export type PricingVariant    = 'cards' | 'table';
export type FaqVariant        = 'accordion' | 'two-column';
export type CtaVariant        = 'centered' | 'banner';
export type FormVariant       = 'simple' | 'split';
export type FooterVariant     = 'minimal' | 'columns';

export type VariantMap = {
  hero:         HeroVariant;
  features:     FeaturesVariant;
  testimonials: TestimonialsVariant;
  pricing:      PricingVariant;
  faq:          FaqVariant;
  cta:          CtaVariant;
  form:         FormVariant;
  footer:       FooterVariant;
};

export type SectionVariant = VariantMap[SectionType];

// --- UI メタ情報（将来の EditPanel variant セレクター用） ---

export const SECTION_VARIANTS: {
  [K in SectionType]: { value: VariantMap[K]; label: string }[];
} = {
  hero:         [{ value: 'centered', label: '中央配置' }, { value: 'split', label: '左右分割' }, { value: 'fullscreen', label: 'フルスクリーン' }],
  features:     [{ value: 'grid', label: 'グリッド' }, { value: 'alternating', label: '交互配置' }],
  testimonials: [{ value: 'cards', label: 'カード' }, { value: 'single', label: '大きく1件' }],
  pricing:      [{ value: 'cards', label: 'カード' }, { value: 'table', label: '比較表' }],
  faq:          [{ value: 'accordion', label: 'アコーディオン' }, { value: 'two-column', label: '2カラム' }],
  cta:          [{ value: 'centered', label: '中央配置' }, { value: 'banner', label: 'バナー' }],
  form:         [{ value: 'simple', label: 'シンプル' }, { value: 'split', label: '左右分割' }],
  footer:       [{ value: 'minimal', label: 'ミニマル' }, { value: 'columns', label: 'カラム' }],
};

// --- デフォルト variant（フォールバック用） ---

export const DEFAULT_VARIANTS: VariantMap = {
  hero:         'centered',
  features:     'grid',
  testimonials: 'cards',
  pricing:      'cards',
  faq:          'accordion',
  cta:          'centered',
  form:         'simple',
  footer:       'minimal',
};

// --- ヘルパー関数 ---

export function getVariant<T extends SectionType>(
  type: T,
  data: Record<string, unknown>,
  fallback?: VariantMap[T]
): VariantMap[T] {
  const v = data?.variant;
  const valid = SECTION_VARIANTS[type].map((o) => o.value) as string[];
  if (typeof v === 'string' && valid.includes(v)) {
    return v as VariantMap[T];
  }
  return fallback ?? DEFAULT_VARIANTS[type];
}
