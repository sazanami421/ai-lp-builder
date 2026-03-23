import { simpleTemplate } from './simple';
import { premiumTemplate } from './premium';
import { popTemplate } from './pop';
import { businessTemplate } from './business';
import { naturalTemplate } from './natural';
import type { GlobalConfig, SectionType } from '@/types/section';
import type { VariantMap } from '@/lib/variants';

export type TemplateDefinition = {
  name: string;
  label: string;
  cssVars: Record<string, string>;
  defaultVariants: VariantMap;
};

export const TEMPLATES: Record<GlobalConfig['template'], TemplateDefinition> = {
  simple: simpleTemplate,
  premium: premiumTemplate,
  pop: popTemplate,
  business: businessTemplate,
  natural: naturalTemplate,
};

export type { SectionType };
