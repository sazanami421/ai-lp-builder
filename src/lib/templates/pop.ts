import type { SectionType } from '@/types/section';

// ドットパターン（ポップで楽しい印象）
const dotSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='2' cy='2' r='1' fill='%23FF6B35' opacity='0.05'/></svg>`;

export const popTemplate = {
  name: 'pop',
  label: 'ポップ',
  cssVars: {
    '--accent': '#FF6B35',
    '--bg': '#FFFBF5',
    '--text': '#1A1A1A',
    '--font-heading': "'DM Sans', sans-serif",
    '--font-body': "'DM Sans', sans-serif",
    '--radius': '12px',
    '--texture': `url("data:image/svg+xml,${encodeURIComponent(dotSvg)}")`,
  },
  defaultVariants: {
    hero: 'centered',
    features: 'grid',
    testimonials: 'cards',
    pricing: 'cards',
    faq: 'two-column',
    cta: 'centered',
    form: 'simple',
    footer: 'minimal',
  } satisfies Record<SectionType, string>,
  defaultSections: [
    'hero', 'features', 'testimonials', 'faq', 'cta', 'form', 'footer',
  ] satisfies SectionType[],
} as const;
