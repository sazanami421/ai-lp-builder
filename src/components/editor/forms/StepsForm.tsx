'use client';

import { StepsSectionData, StepItem } from '@/types/section';
import { SECTION_VARIANTS } from '@/lib/variants';
import IconPicker from '@/components/editor/IconPicker';

type Props = {
  data: StepsSectionData;
  onUpdate: (newData: StepsSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function StepsForm({ data, onUpdate }: Props) {
  const currentVariant = (data as Record<string, unknown>).variant as string ?? 'horizontal';

  const updateItem = (index: number, field: keyof StepItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({
      ...data,
      items: [...data.items, { icon: '', title: '', description: '' }],
    });
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
          {SECTION_VARIANTS.steps.map((v) => (
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

      {/* タイトル */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">セクションタイトル</label>
        <input
          type="text"
          value={data.title ?? ''}
          onChange={(e) => onUpdate({ ...data, title: e.target.value })}
          placeholder="ご利用の流れ"
          className={inputClass}
        />
      </div>

      {/* ステップ */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">ステップ</span>
          <button onClick={addItem} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 追加
          </button>
        </div>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">ステップ {i + 1}</span>
                <button
                  onClick={() => removeItem(i)}
                  className="text-xs text-red-400 transition hover:text-red-600"
                >
                  削除
                </button>
              </div>
              <div className="space-y-2">
                <IconPicker
                  value={item.icon}
                  onChange={(name) => updateItem(i, 'icon', name)}
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(i, 'title', e.target.value)}
                  placeholder="ステップタイトル"
                  className={inputClass}
                />
                <textarea
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  placeholder="説明文"
                  rows={2}
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
