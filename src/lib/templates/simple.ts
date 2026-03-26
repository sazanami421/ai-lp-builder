import type { TemplateDefinition } from '@/types/template';

export const simpleTemplate = {
  name: 'simple',
  label: 'シンプル',
  cssVars: {
    '--accent': '#2B2B28',
    '--accent-light': '#EBEBEA',
    '--bg': '#FFFFFF',
    '--bg-secondary': '#F7F7F6',
    '--text': '#2B2B28',
    '--font-heading': "'Outfit', sans-serif",
    '--font-body': "'Outfit', sans-serif",
    '--radius': '4px',
    '--texture': 'none',
  },
  defaultVariants: {
    hero: 'centered',
    features: 'grid',
    testimonials: 'cards',
    pricing: 'cards',
    faq: 'accordion',
    cta: 'centered',
    form: 'simple',
    footer: 'minimal',
  },
} as const satisfies TemplateDefinition;
