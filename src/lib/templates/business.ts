import type { SectionType } from '@/types/section';

// 薄い斜線パターン（ビジネスライクな整然とした印象）
const lineSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'><path d='M-1,1 l2,-2 M0,8 l8,-8 M7,9 l2,-2' stroke='%231E56A0' stroke-width='0.5' opacity='0.04'/></svg>`;

export const businessTemplate = {
  name: 'business',
  label: 'ビジネス',
  cssVars: {
    '--accent': '#1E56A0',
    '--bg': '#FFFFFF',
    '--text': '#1A1A2E',
    '--font-heading': "'Plus Jakarta Sans', sans-serif",
    '--font-body': "'Plus Jakarta Sans', sans-serif",
    '--radius': '6px',
    '--texture': `url("data:image/svg+xml,${encodeURIComponent(lineSvg)}")`,
  },
  defaultVariants: {
    hero: 'split',
    features: 'alternating',
    testimonials: 'cards',
    pricing: 'table',
    faq: 'accordion',
    cta: 'banner',
    form: 'split',
    footer: 'columns',
  } satisfies Record<SectionType, string>,
  defaultSections: [
    'hero', 'features', 'testimonials', 'pricing', 'faq', 'cta', 'form', 'footer',
  ] satisfies SectionType[],
} as const;
