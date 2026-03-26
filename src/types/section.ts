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
  variant?: 'centered' | 'split' | 'fullscreen';
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImage?: string;
  sideImage?: string; // split variant: 右カラム画像
};

export type FeatureItem = {
  icon?: string;
  image?: string; // alternating variant: 各アイテムの画像
  title: string;
  description: string;
};

export type FeaturesSectionData = {
  variant?: 'grid' | 'alternating';
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
  variant?: 'cards' | 'single';
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
  variant?: 'cards' | 'table';
  title: string;
  plans: PricingPlan[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSectionData = {
  variant?: 'accordion' | 'two-column';
  title: string;
  items: FaqItem[];
};

export type CtaSectionData = {
  variant?: 'centered' | 'banner';
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
  variant?: 'simple' | 'split';
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
  variant?: 'minimal' | 'columns';
  logo?: string;
  links?: FooterLink[];
  columns?: { heading: string; links: FooterLink[] }[]; // columns variant
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
