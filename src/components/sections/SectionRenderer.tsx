import { SectionType } from '@/types/section';
import type {
  HeroSectionData,
  FeaturesSectionData,
  TestimonialsSectionData,
  PricingSectionData,
  FaqSectionData,
  CtaSectionData,
  FormSectionData,
  FooterSectionData,
} from '@/types/section';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import FaqSection from './FaqSection';
import CtaSection from './CtaSection';
import FormSection from './FormSection';
import FooterSection from './FooterSection';
import { DEFAULT_SECTION_DATA } from '@/lib/defaultSectionData';

// DB から返る Json を各型にキャストするユーティリティ
function cast<T>(data: unknown): T {
  return data as T;
}

type Props = {
  type: SectionType;
  data: unknown;
  styleOverrides?: Record<string, string>;
  pageId?: string;
};

export default function SectionRenderer({ type, data, styleOverrides, pageId }: Props) {
  // データが空オブジェクトの場合はデフォルトを使用
  const resolved = (data && typeof data === 'object' && Object.keys(data).length > 0)
    ? data
    : DEFAULT_SECTION_DATA[type];

  const so = styleOverrides ?? {};

  switch (type) {
    case 'hero':
      return <HeroSection data={cast<HeroSectionData>(resolved)} styleOverrides={so} />;
    case 'features':
      return <FeaturesSection data={cast<FeaturesSectionData>(resolved)} styleOverrides={so} />;
    case 'testimonials':
      return <TestimonialsSection data={cast<TestimonialsSectionData>(resolved)} styleOverrides={so} />;
    case 'pricing':
      return <PricingSection data={cast<PricingSectionData>(resolved)} styleOverrides={so} />;
    case 'faq':
      return <FaqSection data={cast<FaqSectionData>(resolved)} styleOverrides={so} />;
    case 'cta':
      return <CtaSection data={cast<CtaSectionData>(resolved)} styleOverrides={so} />;
    case 'form':
      return <FormSection data={cast<FormSectionData>(resolved)} styleOverrides={so} pageId={pageId} />;
    case 'footer':
      return <FooterSection data={cast<FooterSectionData>(resolved)} styleOverrides={so} />;
    default:
      return null;
  }
}
