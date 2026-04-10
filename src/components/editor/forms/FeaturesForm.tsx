'use client';

import { useRef, useState } from 'react';
import { FeaturesSectionData, FeatureItem } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FeaturesSectionData;
  onUpdate: (newData: FeaturesSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function FeaturesForm({ data, onUpdate }: Props) {
  const variant = getVariant('features', data as Record<string, unknown>);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const setTitle = (title: string) => onUpdate({ ...data, title });

  const updateItem = (index: number, field: keyof FeatureItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...data, items });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) updateItem(index, 'image', result.url);
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
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
        <label className="mb-1 block text-xs font-medium text-gray-600">レイアウト</label>
        <div className="flex gap-2">
          {([
            { value: 'grid', label: 'グリッド' },
            { value: 'alternating', label: '交互配置' },
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
          placeholder="選ばれる3つの理由"
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">特徴項目</span>
          <button onClick={addItem} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 追加
          </button>
        </div>

        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">項目 {i + 1}</span>
                <button onClick={() => removeItem(i)} className="text-xs text-red-400 transition hover:text-red-600">
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
                <div>
                    {item.image ? (
                      <div className="space-y-1">
                        <img src={item.image} alt="" className="h-20 w-full rounded-lg object-cover" />
                        <button
                          onClick={() => updateItem(i, 'image', '')}
                          className="text-xs text-red-500 hover:underline"
                        >
                          画像を削除
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => fileInputRefs.current[i]?.click()}
                          disabled={uploadingIndex === i}
                          className="flex w-full items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 py-3 text-xs text-gray-400 transition hover:border-gray-300 cursor-pointer disabled:opacity-50"
                        >
                          {uploadingIndex === i ? 'アップロード中…' : '画像をアップロード（任意）'}
                        </button>
                        <input
                          ref={(el) => { fileInputRefs.current[i] = el; }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, i)}
                        />
                      </>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
