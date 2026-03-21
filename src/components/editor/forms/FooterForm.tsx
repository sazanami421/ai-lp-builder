'use client';

import { useRef, useState } from 'react';
import { FooterSectionData, FooterLink } from '@/types/section';

type Props = {
  data: FooterSectionData;
  onUpdate: (newData: FooterSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function FooterForm({ data, onUpdate }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateLink = (index: number, field: keyof FooterLink, value: string) => {
    const links = (data.links ?? []).map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    onUpdate({ ...data, links });
  };

  const addLink = () => {
    onUpdate({ ...data, links: [...(data.links ?? []), { label: '', url: '' }] });
  };

  const removeLink = (index: number) => {
    onUpdate({ ...data, links: (data.links ?? []).filter((_, i) => i !== index) });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (res.ok) onUpdate({ ...data, logo: result.url });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* ロゴ */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">ロゴ画像</label>
        {data.logo ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.logo} alt="ロゴ" className="h-10 object-contain" />
            <button
              onClick={() => onUpdate({ ...data, logo: undefined })}
              className="text-xs text-red-500 hover:underline"
            >
              削除
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 py-3 text-xs text-gray-400 transition hover:border-gray-300 hover:text-gray-500 disabled:opacity-50"
          >
            {uploading ? 'アップロード中…' : '🖼️ ロゴをアップロード'}
          </button>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
      </div>

      {/* コピーライト */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">コピーライト</label>
        <input
          type="text"
          value={data.copyright ?? ''}
          onChange={(e) => onUpdate({ ...data, copyright: e.target.value })}
          placeholder={`© ${new Date().getFullYear()} Your Company.`}
          className={inputClass}
        />
      </div>

      {/* リンク */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">リンク</span>
          <button onClick={addLink} className="text-xs text-blue-500 transition hover:text-blue-700">
            + 追加
          </button>
        </div>
        <div className="space-y-2">
          {(data.links ?? []).map((link, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLink(i, 'label', e.target.value)}
                placeholder="ラベル"
                className={inputClass}
              />
              <input
                type="url"
                value={link.url}
                onChange={(e) => updateLink(i, 'url', e.target.value)}
                placeholder="URL"
                className={inputClass}
              />
              <button
                onClick={() => removeLink(i)}
                className="shrink-0 text-xs text-red-400 hover:text-red-600"
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
