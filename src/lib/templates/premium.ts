import type { SectionType } from '@/types/section';

// 高級紙のようなきめ細かいグレインテクスチャー
const grainSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23g)' opacity='0.06'/></svg>`;

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
    '--texture': `url("data:image/svg+xml,${encodeURIComponent(grainSvg)}")`,
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
