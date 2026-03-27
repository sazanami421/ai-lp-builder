'use client';

import { StatsSectionData, StatItem } from '@/types/section';
import { SECTION_VARIANTS } from '@/lib/variants';

type Props = {
  data: StatsSectionData;
  onUpdate: (newData: StatsSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function StatsForm({ data, onUpdate }: Props) {
  const currentVariant = (data as Record<string, unknown>).variant as string ?? 'row';

  const updateItem = (index: number, field: keyof StatItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({ ...data, items: [...data.items, { value: '', label: '' }] });
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      {/* variant セレクター */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">レイアウト</label>
        <div className="flex gap-2">
          {SECTION_VARIANTS.stats.map((v) => (
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

      {/* タイトル（任意） */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">セクションタイトル（任意）</label>
        <input
          type="text"
          value={data.title ?? ''}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="数字で見る実績"
          className={inputClass}
        />
      </div>

      {/* 数値アイテム */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">数値アイテム</span>
          <button onClick={addItem} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 追加
          </button>
        </div>
        <div className="space-y-2">
          {data.items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => updateItem(i, 'value', e.target.value)}
                  placeholder="98%"
                  className={`${inputClass} w-[35%]`}
                />
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => updateItem(i, 'label', e.target.value)}
                  placeholder="顧客満足度"
                  className={`${inputClass} w-[65%]`}
                />
              </div>
              <button
                onClick={() => removeItem(i)}
                className="shrink-0 text-xs text-red-400 transition hover:text-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
