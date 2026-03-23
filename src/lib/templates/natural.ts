export const naturalTemplate = {
  name: 'natural',
  label: 'ナチュラル',
  cssVars: {
    '--accent': '#2D8A6E',
    '--bg': '#FAFAF7',
    '--text': '#2C3E2D',
    '--font-heading': "'Lora', serif",
    '--font-body': "'Raleway', sans-serif",
    '--radius': '16px',
  },
  defaultVariants: {
    hero: 'centered',
    features: 'alternating',
    testimonials: 'single',
    pricing: 'cards',
    faq: 'accordion',
    cta: 'centered',
    form: 'simple',
    footer: 'minimal',
  },
} as const;
