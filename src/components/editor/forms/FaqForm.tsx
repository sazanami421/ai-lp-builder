'use client';

import { FaqSectionData, FaqItem } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FaqSectionData;
  onUpdate: (newData: FaqSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function FaqForm({ data, onUpdate }: Props) {
  const variant = getVariant('faq', data as Record<string, unknown>);
  const setTitle = (title: string) => onUpdate({ ...data, title });

  const updateItem = (index: number, field: keyof FaqItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({
      ...data,
      items: [...data.items, { question: '', answer: '' }],
    });
  };

  const removeItem = (index: number) => {
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">レイアウト</label>
        <div className="flex gap-2">
          {([
            { value: 'accordion', label: 'アコーディオン' },
            { value: 'two-column', label: '2カラム' },
          ] as const).map((v) => (
            <button
              key={v.value}
              onClick={() => onUpdate({ ...data, variant: v.value })}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition cursor-pointer ${
                variant === v.value
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">セクションタイトル</label>
        <input
          type="text"
          value={data.title ?? ''}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="よくある質問"
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">Q&A 項目</span>
          <button onClick={addItem} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 追加
          </button>
        </div>

        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Q{i + 1}</span>
                <button
                  onClick={() => removeItem(i)}
                  className="text-xs text-red-400 transition hover:text-red-600"
                >
                  削除
                </button>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateItem(i, 'question', e.target.value)}
                  placeholder="質問文"
                  className={inputClass}
                />
                <textarea
                  rows={3}
                  value={item.answer}
                  onChange={(e) => updateItem(i, 'answer', e.target.value)}
                  placeholder="回答文"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
