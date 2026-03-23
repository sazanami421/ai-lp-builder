export const simpleTemplate = {
  name: 'simple',
  label: 'シンプル',
  cssVars: {
    '--accent': '#2B2B28',
    '--bg': '#FFFFFF',
    '--text': '#2B2B28',
    '--font-heading': "'Outfit', sans-serif",
    '--font-body': "'Outfit', sans-serif",
    '--radius': '4px',
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
} as const;
