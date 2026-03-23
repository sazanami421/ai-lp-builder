import type {
  HeroVariant,
  FeaturesVariant,
  TestimonialsVariant,
  PricingVariant,
  FaqVariant,
  CtaVariant,
  FormVariant,
  FooterVariant,
} from '@/lib/variants';

// セクション type 識別子
export type SectionType =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'form'
  | 'footer';

// ページ全体のグローバル設定（テーマ）
export type GlobalConfig = {
  template: 'simple' | 'premium' | 'pop' | 'business' | 'natural';
  cssVars?: Record<string, string>;
};

// 各セクション共通フィールド
export type SectionBase = {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  styleOverrides?: Record<string, string>;
};

// --- セクション固有データ型 ---

export type HeroSectionData = {
  variant?: HeroVariant;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImage?: string;  // centered で使用
  sideImage?: string;         // split で使用
};

export type FeatureItem = {
  icon?: string;
  title: string;
  description: string;
  image?: string;             // alternating で使用
};

export type FeaturesSectionData = {
  variant?: FeaturesVariant;
  title: string;
  items: FeatureItem[];
};

export type TestimonialItem = {
  body: string;
  name: string;
  role?: string;
  avatarUrl?: string;
};

export type TestimonialsSectionData = {
  variant?: TestimonialsVariant;
  title: string;
  items: TestimonialItem[];
};

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  note?: string;
  highlighted?: boolean;
  ctaText?: string;
  ctaUrl?: string;
};

export type PricingSectionData = {
  variant?: PricingVariant;
  title: string;
  plans: PricingPlan[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSectionData = {
  variant?: FaqVariant;
  title: string;
  items: FaqItem[];
};

export type CtaSectionData = {
  variant?: CtaVariant;
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
};

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'textarea';
  placeholder?: string;
  required: boolean;
};

export type FormSectionData = {
  variant?: FormVariant;
  title?: string;
  description?: string;
  fields: FormField[];
  submitText: string;
  successMessage: string;
};

export type FooterLink = {
  label: string;
  url: string;
};

export type FooterSectionData = {
  variant?: FooterVariant;
  logo?: string;
  links?: FooterLink[];
  copyright: string;
};

// セクションデータのユニオン型
export type SectionData =
  | HeroSectionData
  | FeaturesSectionData
  | TestimonialsSectionData
  | PricingSectionData
  | FaqSectionData
  | CtaSectionData
  | FormSectionData
  | FooterSectionData;

// セクション完全型
export type Section = SectionBase & { data: SectionData };
