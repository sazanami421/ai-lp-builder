'use client';

import { useRef, useState } from 'react';
import { HeroSectionData } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: HeroSectionData;
  onUpdate: (newData: HeroSectionData) => void;
};

export default function HeroForm({ data, onUpdate }: Props) {
  const variant = getVariant('hero', data as Record<string, unknown>);
  const [uploading, setUploading] = useState<'bg' | 'side' | null>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const sideFileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof HeroSectionData, value: string) => {
    onUpdate({ ...data, [key]: value });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'backgroundImage' | 'sideImage'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field === 'backgroundImage' ? 'bg' : 'side');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) onUpdate({ ...data, [field]: result.url });
    } finally {
      setUploading(null);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Field label="レイアウト">
        <div className="flex gap-2">
          {([
            { value: 'centered', label: '中央配置' },
            { value: 'split', label: '左右分割' },
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
      </Field>

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

      <Field label={variant === 'split' ? '背景画像（centered 用）' : '背景画像'}>
        <ImageUploadField
          url={data.backgroundImage}
          uploading={uploading === 'bg'}
          onUpload={(e) => handleImageUpload(e, 'backgroundImage')}
          onClear={() => onUpdate({ ...data, backgroundImage: undefined })}
          inputRef={bgFileInputRef}
        />
      </Field>

      {variant === 'split' && (
        <Field label="サイド画像（split 用）">
          <ImageUploadField
            url={data.sideImage}
            uploading={uploading === 'side'}
            onUpload={(e) => handleImageUpload(e, 'sideImage')}
            onClear={() => onUpdate({ ...data, sideImage: undefined })}
            inputRef={sideFileInputRef}
          />
        </Field>
      )}
    </div>
  );
}

function ImageUploadField({
  url, uploading, onUpload, onClear, inputRef,
}: {
  url?: string;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return url ? (
    <div className="space-y-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" className="h-24 w-full rounded-lg object-cover" />
      <button onClick={onClear} className="text-xs text-red-500 hover:underline">
        画像を削除
      </button>
    </div>
  ) : (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-4 text-xs text-gray-400 transition hover:border-gray-300 hover:text-gray-500 disabled:opacity-50 cursor-pointer"
      >
        {uploading ? 'アップロード中…' : '画像をアップロード'}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onUpload} />
    </>
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
