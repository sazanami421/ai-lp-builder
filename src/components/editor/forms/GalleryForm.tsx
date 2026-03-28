'use client';

import { useRef, useState } from 'react';
import { GallerySectionData, GalleryItem } from '@/types/section';
import { SECTION_VARIANTS } from '@/lib/variants';

type Props = {
  data: GallerySectionData;
  onUpdate: (newData: GallerySectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function GalleryForm({ data, onUpdate }: Props) {
  const currentVariant = (data as Record<string, unknown>).variant as string ?? 'grid';
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetIndexRef = useRef<number>(-1);

  const updateItem = (index: number, field: keyof GalleryItem, value: string) => {
    const items = data.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onUpdate({ ...data, items });
  };

  const addItem = () => {
    onUpdate({ ...data, items: [...data.items, { imageUrl: '', caption: '' }] });
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    onUpdate({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const openUpload = (index: number) => {
    targetIndexRef.current = index;
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const index = targetIndexRef.current;
    if (!file || index < 0) return;

    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) updateItem(index, 'imageUrl', result.url);
    } finally {
      setUploadingIndex(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* variant セレクター */}
      <div>
        <label className="mb-1.5 block text-xs font-medium text-gray-600">レイアウト</label>
        <div className="flex gap-2">
          {SECTION_VARIANTS.gallery.map((v) => (
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
          placeholder="ギャラリー"
          className={inputClass}
        />
      </div>

      {/* 画像アイテム */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">画像</span>
          <button onClick={addItem} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 追加
          </button>
        </div>
        <div className="space-y-3">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">画像 {i + 1}</span>
                <button
                  onClick={() => removeItem(i)}
                  className="text-xs text-red-400 transition hover:text-red-600"
                >
                  削除
                </button>
              </div>
              <div className="space-y-2">
                {/* 画像アップロード */}
                {item.imageUrl ? (
                  <div className="space-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt="" className="h-20 w-full rounded-lg object-cover" />
                    <button
                      onClick={() => updateItem(i, 'imageUrl', '')}
                      className="text-xs text-red-500 hover:underline"
                    >
                      画像を削除
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => openUpload(i)}
                    disabled={uploadingIndex === i}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-3 text-xs text-gray-400 transition hover:border-gray-300 hover:text-gray-500 disabled:opacity-50"
                  >
                    {uploadingIndex === i ? 'アップロード中…' : '画像をアップロード'}
                  </button>
                )}
                <input
                  type="text"
                  value={item.caption ?? ''}
                  onChange={(e) => updateItem(i, 'caption', e.target.value)}
                  placeholder="キャプション（任意）"
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 共有ファイル input */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
    </div>
  );
}
