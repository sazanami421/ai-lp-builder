import type { TemplateDefinition } from '@/types/template';

export const premiumTemplate = {
  name: 'premium',
  label: 'プレミアム',
  cssVars: {
    '--accent': '#C6A96C',
    '--accent-light': '#2C2415',
    '--bg': '#0F0F0F',
    '--bg-secondary': '#191919',
    '--text': '#F5F0E8',
    '--font-heading': "'Cormorant Garamond', serif",
    '--font-body': "'Cormorant Garamond', serif",
    '--radius': '2px',
    '--texture': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E\")",
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
  },
} as const satisfies TemplateDefinition;
