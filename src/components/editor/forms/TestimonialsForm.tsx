'use client';

import { useRef, useState } from 'react';
import { TestimonialsSectionData, TestimonialItem } from '@/types/section';

type Props = {
  data: TestimonialsSectionData;
  onUpdate: (newData: TestimonialsSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function TestimonialsForm({ data, onUpdate }: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTargetIndex = useRef<number>(-1);

  const setTitle = (title: string) => onUpdate({ ...data, title });

  const updateItem = (index: number, field: keyof TestimonialItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({
      ...data,
      items: [...data.items, { body: '', name: '', role: '', avatarUrl: '' }],
    });
  };

  const removeItem = (index: number) => {
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const handleAvatarClick = (index: number) => {
    uploadTargetIndex.current = index;
    fileInputRef.current?.click();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = uploadTargetIndex.current;
    if (!file || index < 0) return;

    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) updateItem(index, 'avatarUrl', result.url);
    } finally {
      setUploadingIndex(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">セクションタイトル</label>
        <input
          type="text"
          value={data.title ?? ''}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="お客様の声"
          className={inputClass}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">口コミ・レビュー</span>
          <button onClick={addItem} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 追加
          </button>
        </div>

        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">レビュー {i + 1}</span>
                <button
                  onClick={() => removeItem(i)}
                  className="text-xs text-red-400 transition hover:text-red-600"
                >
                  削除
                </button>
              </div>

              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={item.body}
                  onChange={(e) => updateItem(i, 'body', e.target.value)}
                  placeholder="レビュー本文"
                  className={`${inputClass} resize-none`}
                />
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(i, 'name', e.target.value)}
                  placeholder="お名前"
                  className={inputClass}
                />
                <input
                  type="text"
                  value={item.role ?? ''}
                  onChange={(e) => updateItem(i, 'role', e.target.value)}
                  placeholder="肩書き（例：株式会社〇〇 代表）"
                  className={inputClass}
                />

                {/* アバター画像 */}
                {item.avatarUrl ? (
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.avatarUrl} alt={item.name} className="h-8 w-8 rounded-full object-cover" />
                    <button
                      onClick={() => updateItem(i, 'avatarUrl', '')}
                      className="text-xs text-red-400 hover:underline"
                    >
                      削除
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAvatarClick(i)}
                    disabled={uploadingIndex === i}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 py-2 text-xs text-gray-400 transition hover:border-gray-300 hover:text-gray-500 disabled:opacity-50"
                  >
                    {uploadingIndex === i ? 'アップロード中…' : '👤 アバター画像を追加'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />
    </div>
  );
}
