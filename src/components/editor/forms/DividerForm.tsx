'use client';

import { DividerSectionData } from '@/types/section';
import { SECTION_VARIANTS } from '@/lib/variants';

type Props = {
  data: DividerSectionData;
  onUpdate: (newData: DividerSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function DividerForm({ data, onUpdate }: Props) {
  const currentVariant = (data as Record<string, unknown>).variant as string ?? 'gradient';

  return (
    <div className="space-y-4">
      {/* variant セレクター */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">スタイル</label>
        <div className="flex gap-2">
          {SECTION_VARIANTS.divider.map((v) => (
            <button
              key={v.value}
              onClick={() => onUpdate({ ...data, variant: v.value })}
              className="flex-1 rounded-lg border px-3 py-1.5 text-xs font-medium transition"
              style={
                currentVariant === v.value
                  ? { borderColor: 'var(--accent)', color: 'var(--accent)', backgroundColor: 'color-mix(in srgb, var(--accent) 8%, transparent)' }
                  : { borderColor: '#e5e7eb', color: '#6b7280' }
              }
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* テキスト（任意） */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">テキスト（任意）</label>
        <input
          type="text"
          value={data.text ?? ''}
          onChange={(e) => onUpdate({ ...data, text: e.target.value })}
          placeholder="区切りテキスト（省略可）"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-400">装飾ライン スタイル時は中央に表示されます</p>
      </div>
    </div>
  );
}
