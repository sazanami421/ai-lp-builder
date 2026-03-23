import type { SectionType } from '@/types/section';

// 和紙・リネン風テクスチャー（ナチュラルで温かみのある印象）
const washiSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><filter id='w'><feTurbulence type='fractalNoise' baseFrequency='0.5' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23w)' opacity='0.04'/></svg>`;

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
    '--texture': `url("data:image/svg+xml,${encodeURIComponent(washiSvg)}")`,
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
  } satisfies Record<SectionType, string>,
  defaultSections: [
    'hero', 'features', 'testimonials', 'cta', 'form', 'footer',
  ] satisfies SectionType[],
} as const;
