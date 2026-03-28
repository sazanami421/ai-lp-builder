'use client';

import { SectionItem } from './SectionList';
import { SectionType } from '@/types/section';
import type {
  HeroSectionData,
  CtaSectionData,
  FeaturesSectionData,
  TestimonialsSectionData,
  FaqSectionData,
  PricingSectionData,
  PricingTableSectionData,
  StepsSectionData,
  StatsSectionData,
  LogoBarSectionData,
  GallerySectionData,
  DividerSectionData,
  FormSectionData,
  FooterSectionData,
} from '@/types/section';
import HeroForm from './forms/HeroForm';
import CtaForm from './forms/CtaForm';
import FeaturesForm from './forms/FeaturesForm';
import TestimonialsForm from './forms/TestimonialsForm';
import FaqForm from './forms/FaqForm';
import PricingForm from './forms/PricingForm';
import PricingTableForm from './forms/PricingTableForm';
import StepsForm from './forms/StepsForm';
import StatsForm from './forms/StatsForm';
import LogoBarForm from './forms/LogoBarForm';
import GalleryForm from './forms/GalleryForm';
import DividerForm from './forms/DividerForm';
import FormForm from './forms/FormForm';
import FooterForm from './forms/FooterForm';
import { DEFAULT_SECTION_DATA } from '@/lib/defaultSectionData';

type Props = {
  section: SectionItem | null;
  onUpdate: (newData: unknown) => void;
};

const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero',
  features: 'Features',
  testimonials: 'Testimonials',
  pricing: 'Pricing',
  pricing_table: 'Pricing Table',
  faq: 'FAQ',
  cta: 'CTA',
  steps: 'Steps',
  stats: 'Stats',
  logo_bar: 'Logo Bar',
  gallery: 'Gallery',
  divider: 'Divider',
  form: 'Form',
  footer: 'Footer',
};


export default function EditPanel({ section, onUpdate }: Props) {
  if (!section) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-center text-xs text-gray-400">
          左のリストからセクションを<br />選択してください
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden border-t border-gray-100">
      <div className="shrink-0 border-b border-gray-100 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {SECTION_LABELS[section.type]} を編集
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <SectionForm section={section} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

function SectionForm({ section, onUpdate }: { section: SectionItem; onUpdate: (d: unknown) => void }) {
  const hasData = section.data && typeof section.data === 'object' && Object.keys(section.data as object).length > 0;
  const data = hasData ? section.data : DEFAULT_SECTION_DATA[section.type];

  switch (section.type) {
    case 'hero':
      return <HeroForm data={data as HeroSectionData} onUpdate={onUpdate} />;
    case 'cta':
      return <CtaForm data={data as CtaSectionData} onUpdate={onUpdate} />;
    case 'features':
      return <FeaturesForm data={data as FeaturesSectionData} onUpdate={onUpdate} />;
    case 'testimonials':
      return <TestimonialsForm data={data as TestimonialsSectionData} onUpdate={onUpdate} />;
    case 'faq':
      return <FaqForm data={data as FaqSectionData} onUpdate={onUpdate} />;
    case 'pricing':
      return <PricingForm data={data as PricingSectionData} onUpdate={onUpdate} />;
    case 'pricing_table':
      return <PricingTableForm data={data as PricingTableSectionData} onUpdate={onUpdate} />;
    case 'steps':
      return <StepsForm data={data as StepsSectionData} onUpdate={onUpdate} />;
    case 'stats':
      return <StatsForm data={data as StatsSectionData} onUpdate={onUpdate} />;
    case 'logo_bar':
      return <LogoBarForm data={data as LogoBarSectionData} onUpdate={onUpdate} />;
    case 'gallery':
      return <GalleryForm data={data as GallerySectionData} onUpdate={onUpdate} />;
    case 'divider':
      return <DividerForm data={data as DividerSectionData} onUpdate={onUpdate} />;
    case 'form':
      return <FormForm data={data as FormSectionData} onUpdate={onUpdate} />;
    case 'footer':
      return <FooterForm data={data as FooterSectionData} onUpdate={onUpdate} />;
  }
}
