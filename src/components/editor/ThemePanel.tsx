'use client';

import { GlobalConfig } from '@/types/section';
import { TEMPLATES } from '@/lib/templates';

type Props = {
  template: GlobalConfig['template'];
  cssVars: Record<string, string>;
  onChange: (cssVars: Record<string, string>) => void;
};

const COLOR_FIELDS: { key: string; label: string }[] = [
  { key: '--accent',       label: 'アクセント' },
  { key: '--accent-light', label: 'アクセント薄' },
  { key: '--bg',           label: '背景' },
  { key: '--bg-secondary', label: '背景2' },
  { key: '--text',         label: 'テキスト' },
];

export default function ThemePanel({ template, cssVars, onChange }: Props) {
  const templateVars = TEMPLATES[template].cssVars;

  const getValue = (key: string) =>
    cssVars[key] ?? (templateVars as Record<string, string>)[key] ?? '#000000';

  const handleChange = (key: string, value: string) => {
    const templateDefault = (templateVars as Record<string, string>)[key];
    // テンプレートのデフォルト値と同じなら上書きエントリを削除してクリーンに保つ
    if (value === templateDefault) {
      const next = { ...cssVars };
      delete next[key];
      onChange(next);
    } else {
      onChange({ ...cssVars, [key]: value });
    }
  };

  const hasCustom = Object.keys(cssVars).length > 0;

  return (
    <div className="border-b border-gray-100 px-4 py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">カラー</span>
        {hasCustom && (
          <button
            onClick={() => onChange({})}
            className="text-[10px] text-gray-400 transition hover:text-gray-600"
          >
            リセット
          </button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-2">
        {COLOR_FIELDS.map(({ key, label }) => (
          <label key={key} className="flex cursor-pointer flex-col items-center gap-1">
            <div className="relative h-7 w-7 rounded-full border border-gray-200 shadow-sm"
              style={{ backgroundColor: getValue(key) }}
            >
              <input
                type="color"
                value={getValue(key)}
                onChange={(e) => handleChange(key, e.target.value)}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <span className="text-[9px] text-gray-400">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
