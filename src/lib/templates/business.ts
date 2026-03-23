import type { SectionType } from '@/types/section';

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
