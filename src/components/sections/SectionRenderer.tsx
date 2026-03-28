import { SectionType } from '@/types/section';
import type {
  HeroSectionData,
  FeaturesSectionData,
  TestimonialsSectionData,
  PricingSectionData,
  PricingTableSectionData,
  FaqSectionData,
  CtaSectionData,
  StepsSectionData,
  StatsSectionData,
  LogoBarSectionData,
  GallerySectionData,
  DividerSectionData,
  FormSectionData,
  FooterSectionData,
} from '@/types/section';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import TestimonialsSection from './TestimonialsSection';
import PricingSection from './PricingSection';
import PricingTableSection from './PricingTableSection';
import FaqSection from './FaqSection';
import StepsSection from './StepsSection';
import StatsSection from './StatsSection';
import LogoBarSection from './LogoBarSection';
import GallerySection from './GallerySection';
import DividerSection from './DividerSection';
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
    case 'pricing_table':
      return <PricingTableSection data={cast<PricingTableSectionData>(resolved)} styleOverrides={so} />;
    case 'steps':
      return <StepsSection data={cast<StepsSectionData>(resolved)} styleOverrides={so} />;
    case 'stats':
      return <StatsSection data={cast<StatsSectionData>(resolved)} styleOverrides={so} />;
    case 'logo_bar':
      return <LogoBarSection data={cast<LogoBarSectionData>(resolved)} styleOverrides={so} />;
    case 'gallery':
      return <GallerySection data={cast<GallerySectionData>(resolved)} styleOverrides={so} />;
    case 'divider':
      return <DividerSection data={cast<DividerSectionData>(resolved)} styleOverrides={so} />;
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
