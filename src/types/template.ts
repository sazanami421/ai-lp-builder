import type { VariantMap } from '@/lib/variants';

export type TemplateDefinition = {
  name: string;
  label: string;
  cssVars: Record<string, string>;
  defaultVariants: VariantMap;
};
