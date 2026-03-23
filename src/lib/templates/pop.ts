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
  },
} as const;
