import { simpleTemplate } from './simple';
import { premiumTemplate } from './premium';
import { popTemplate } from './pop';
import { businessTemplate } from './business';
import { naturalTemplate } from './natural';
import type { GlobalConfig, SectionType } from '@/types/section';
import type { TemplateDefinition } from '@/types/template';

export type { TemplateDefinition };

export const TEMPLATES: Record<GlobalConfig['template'], TemplateDefinition> = {
  simple: simpleTemplate,
  premium: premiumTemplate,
  pop: popTemplate,
  business: businessTemplate,
  natural: naturalTemplate,
};

export type { SectionType };
