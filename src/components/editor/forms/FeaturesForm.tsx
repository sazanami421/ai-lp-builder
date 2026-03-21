'use client';

import { FeaturesSectionData, FeatureItem } from '@/types/section';

type Props = {
  data: FeaturesSectionData;
  onUpdate: (newData: FeaturesSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function FeaturesForm({ data, onUpdate }: Props) {
  const setTitle = (title: string) => onUpdate({ ...data, title });

  const updateItem = (index: number, field: keyof FeatureItem, value: string) => {
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
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">セクションタイトル</label>
        <input
          type="text"
          value={data.title ?? ''}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="選ばれる3つの理由"
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">特徴項目</span>
          <button
            onClick={addItem}
            className="text-xs text-blue-500 transition hover:text-blue-700"
          >
            + 追加
          </button>
        </div>

        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">項目 {i + 1}</span>
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
                  value={item.icon ?? ''}
                  onChange={(e) => updateItem(i, 'icon', e.target.value)}
                  placeholder="アイコン（絵文字可: ⚡）"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(i, 'title', e.target.value)}
                  placeholder="タイトル"
                  className={inputClass}
                />
                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => updateItem(i, 'description', e.target.value)}
                  placeholder="説明文"
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
