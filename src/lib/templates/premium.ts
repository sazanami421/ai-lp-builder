import type { SectionType } from '@/types/section';

export const premiumTemplate = {
  name: 'premium',
  label: 'プレミアム',
  cssVars: {
    '--accent': '#C6A96C',
    '--bg': '#0F0F0F',
    '--text': '#F5F0E8',
    '--font-heading': "'Cormorant Garamond', serif",
    '--font-body': "'Cormorant Garamond', serif",
    '--radius': '2px',
  },
  defaultVariants: {
    hero: 'split',
    features: 'alternating',
    testimonials: 'single',
    pricing: 'cards',
    faq: 'accordion',
    cta: 'banner',
    form: 'split',
    footer: 'columns',
  } satisfies Record<SectionType, string>,
  defaultSections: [
    'hero', 'features', 'testimonials', 'pricing', 'cta', 'form', 'footer',
  ] satisfies SectionType[],
} as const;
