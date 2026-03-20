// セクション type 識別子
export type SectionType =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'cta'
  | 'footer';

// ページ全体のグローバル設定（テーマ）
export type GlobalConfig = {
  template: 'simple' | 'premium' | 'pop' | 'business';
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
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImage?: string;
};

export type FeatureItem = {
  icon?: string;
  title: string;
  description: string;
};

export type FeaturesSectionData = {
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
  title: string;
  items: TestimonialItem[];
};

export type PricingPlan = {
  name: string;
  price: string;
  period: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
  ctaUrl?: string;
};

export type PricingSectionData = {
  title: string;
  plans: PricingPlan[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSectionData = {
  title: string;
  items: FaqItem[];
};

export type CtaSectionData = {
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
};

export type FooterLink = {
  label: string;
  url: string;
};

export type FooterSectionData = {
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
  | FooterSectionData;

// セクション完全型
export type Section = SectionBase & { data: SectionData };
