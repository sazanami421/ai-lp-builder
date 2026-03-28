import { SectionType } from '@/types/section';

// --- variant 型定義 ---

export type HeroVariant         = 'centered' | 'split' | 'fullscreen';
export type FeaturesVariant     = 'grid' | 'alternating';
export type TestimonialsVariant = 'cards' | 'single';
export type PricingVariant      = 'cards';
export type PricingTableVariant = 'simple';
export type FaqVariant          = 'accordion' | 'two-column';
export type CtaVariant          = 'centered' | 'banner';
export type StepsVariant        = 'horizontal' | 'vertical';
export type StatsVariant        = 'row' | 'cards';
export type LogoBarVariant      = 'static' | 'scroll';
export type GalleryVariant      = 'grid' | 'masonry';
export type DividerVariant      = 'gradient' | 'ornament';
export type FormVariant         = 'simple' | 'split';
export type FooterVariant       = 'minimal' | 'columns';

export type VariantMap = {
  hero:          HeroVariant;
  features:      FeaturesVariant;
  testimonials:  TestimonialsVariant;
  pricing:       PricingVariant;
  pricing_table: PricingTableVariant;
  faq:           FaqVariant;
  cta:           CtaVariant;
  steps:         StepsVariant;
  stats:         StatsVariant;
  logo_bar:      LogoBarVariant;
  gallery:       GalleryVariant;
  divider:       DividerVariant;
  form:          FormVariant;
  footer:        FooterVariant;
};

export type SectionVariant = VariantMap[SectionType];

// --- UI メタ情報（EditPanel variant セレクター用） ---

export const SECTION_VARIANTS: {
  [K in SectionType]: { value: VariantMap[K]; label: string }[];
} = {
  hero:          [{ value: 'centered', label: '中央配置' }, { value: 'split', label: '左右分割' }, { value: 'fullscreen', label: 'フルスクリーン' }],
  features:      [{ value: 'grid', label: 'グリッド' }, { value: 'alternating', label: '交互配置' }],
  testimonials:  [{ value: 'cards', label: 'カード' }, { value: 'single', label: '大きく1件' }],
  pricing:       [{ value: 'cards', label: 'カード' }],
  pricing_table: [{ value: 'simple', label: 'テーブル' }],
  faq:           [{ value: 'accordion', label: 'アコーディオン' }, { value: 'two-column', label: '2カラム' }],
  cta:           [{ value: 'centered', label: '中央配置' }, { value: 'banner', label: 'バナー' }],
  steps:         [{ value: 'horizontal', label: '横並び' }, { value: 'vertical', label: '縦タイムライン' }],
  stats:         [{ value: 'row', label: '横一列' }, { value: 'cards', label: 'カード' }],
  logo_bar:      [{ value: 'static', label: '静的グリッド' }, { value: 'scroll', label: '横スクロール' }],
  gallery:       [{ value: 'grid', label: 'グリッド' }, { value: 'masonry', label: 'メイソンリー' }],
  divider:       [{ value: 'gradient', label: 'グラデーション' }, { value: 'ornament', label: '装飾ライン' }],
  form:          [{ value: 'simple', label: 'シンプル' }, { value: 'split', label: '左右分割' }],
  footer:        [{ value: 'minimal', label: 'ミニマル' }, { value: 'columns', label: 'カラム' }],
};

// --- デフォルト variant（フォールバック用） ---

export const DEFAULT_VARIANTS: VariantMap = {
  hero:          'centered',
  features:      'grid',
  testimonials:  'cards',
  pricing:       'cards',
  pricing_table: 'simple',
  faq:           'accordion',
  cta:           'centered',
  steps:         'horizontal',
  stats:         'row',
  logo_bar:      'static',
  gallery:       'grid',
  divider:       'gradient',
  form:          'simple',
  footer:        'minimal',
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
