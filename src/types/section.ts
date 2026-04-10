// セクション type 識別子
export type SectionType =
  | 'hero'
  | 'features'
  | 'testimonials'
  | 'pricing'
  | 'pricing_table'
  | 'faq'
  | 'cta'
  | 'steps'
  | 'stats'
  | 'logo_bar'
  | 'gallery'
  | 'divider'
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
  image?: string; // 各アイテムの画像（grid / alternating 両対応・画像優先）
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
  variant?: 'cards';
  title: string;
  plans: PricingPlan[];
};

export type PricingTablePlan = {
  name: string;
  price: string;
  period: string;
  values: (string | boolean)[]; // features[] のインデックスに対応
  highlighted?: boolean;
  ctaText?: string;
  ctaUrl?: string;
};

export type PricingTableSectionData = {
  variant?: 'simple';
  title: string;
  features: string[];
  plans: PricingTablePlan[];
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

export type StepItem = {
  title: string;
  description: string;
  icon?: string;
};

export type StepsSectionData = {
  variant?: 'horizontal' | 'vertical';
  title: string;
  items: StepItem[];
};

export type StatItem = {
  value: string;
  label: string;
};

export type StatsSectionData = {
  variant?: 'row' | 'cards';
  title?: string;
  items: StatItem[];
};

export type LogoItem = {
  imageUrl: string;
  alt: string;
  url?: string;
};

export type LogoBarSectionData = {
  variant?: 'static' | 'scroll';
  title?: string;
  items: LogoItem[];
};

export type GalleryItem = {
  imageUrl: string;
  caption?: string;
};

export type GallerySectionData = {
  variant?: 'grid' | 'masonry';
  title?: string;
  items: GalleryItem[];
};

export type DividerSectionData = {
  variant?: 'gradient' | 'ornament';
  text?: string;
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
  | PricingTableSectionData
  | FaqSectionData
  | CtaSectionData
  | StepsSectionData
  | StatsSectionData
  | LogoBarSectionData
  | GallerySectionData
  | DividerSectionData
  | FormSectionData
  | FooterSectionData;

// セクション完全型
export type Section = SectionBase & { data: SectionData };
