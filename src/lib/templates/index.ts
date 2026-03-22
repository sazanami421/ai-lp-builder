import { simpleTemplate } from './simple';
import { premiumTemplate } from './premium';
import { popTemplate } from './pop';
import { businessTemplate } from './business';
import { naturalTemplate } from './natural';
import type { GlobalConfig } from '@/types/section';

export const TEMPLATES: Record<GlobalConfig['template'], {
  name: string;
  label: string;
  cssVars: Record<string, string>;
}> = {
  simple: simpleTemplate,
  premium: premiumTemplate,
  pop: popTemplate,
  business: businessTemplate,
  natural: naturalTemplate,
};
