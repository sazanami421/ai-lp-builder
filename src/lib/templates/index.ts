import { simpleTemplate } from './simple';
import { premiumTemplate } from './premium';
import { popTemplate } from './pop';
import { businessTemplate } from './business';
import { naturalTemplate } from './natural';
import type { GlobalConfig, SectionType } from '@/types/section';

export type TemplateDefinition = {
  name: string;
  label: string;
  cssVars: Record<string, string>;
  defaultVariants: Record<SectionType, string>;
  defaultSections: readonly SectionType[];
};

export const TEMPLATES: Record<GlobalConfig['template'], TemplateDefinition> = {
  simple: simpleTemplate,
  premium: premiumTemplate,
  pop: popTemplate,
  business: businessTemplate,
  natural: naturalTemplate,
};
