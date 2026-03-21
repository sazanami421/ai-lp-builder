'use client';

import { useRef, useState } from 'react';
import { HeroSectionData } from '@/types/section';

type Props = {
  data: HeroSectionData;
  onUpdate: (newData: HeroSectionData) => void;
};

export default function HeroForm({ data, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof HeroSectionData, value: string) => {
    onUpdate({ ...data, [key]: value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) {
        onUpdate({ ...data, backgroundImage: result.url });
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Field label="見出し（必須）">
        <input
          type="text"
          value={data.headline ?? ''}
          onChange={(e) => set('headline', e.target.value)}
          placeholder="あなたのビジネスを次のレベルへ"
          className={inputClass}
        />
      </Field>

      <Field label="サブ見出し">
        <textarea
          rows={2}
          value={data.subheadline ?? ''}
          onChange={(e) => set('subheadline', e.target.value)}
          placeholder="補足テキストを入力"
          className={`${inputClass} resize-none`}
        />
      </Field>

      <Field label="CTAボタン テキスト">
        <input
          type="text"
          value={data.ctaText ?? ''}
          onChange={(e) => set('ctaText', e.target.value)}
          placeholder="無料で始める"
          className={inputClass}
        />
      </Field>

      <Field label="CTAボタン URL">
        <input
          type="url"
          value={data.ctaUrl ?? ''}
          onChange={(e) => set('ctaUrl', e.target.value)}
          placeholder="https://example.com"
          className={inputClass}
        />
      </Field>

      <Field label="背景画像">
        {data.backgroundImage ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.backgroundImage}
              alt="背景画像"
              className="h-24 w-full rounded-lg object-cover"
            />
            <button
              onClick={() => onUpdate({ ...data, backgroundImage: undefined })}
              className="text-xs text-red-500 hover:underline"
            >
              画像を削除
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-4 text-xs text-gray-400 transition hover:border-gray-300 hover:text-gray-500 disabled:opacity-50"
          >
            {uploading ? '📤 アップロード中…' : '🖼️ 画像をアップロード'}
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';
