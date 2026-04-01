'use client';

import { useRef, useState } from 'react';
import { FooterSectionData, FooterLink } from '@/types/section';
import { getVariant } from '@/lib/variants';

type Props = {
  data: FooterSectionData;
  onUpdate: (newData: FooterSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function FooterForm({ data, onUpdate }: Props) {
  const variant = getVariant('footer', data as Record<string, unknown>);
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

  const addColumn = () => {
    onUpdate({ ...data, columns: [...(data.columns ?? []), { heading: '', links: [{ label: '', url: '' }] }] });
  };

  const removeColumn = (ci: number) => {
    onUpdate({ ...data, columns: (data.columns ?? []).filter((_, i) => i !== ci) });
  };

  const updateColumnHeading = (ci: number, heading: string) => {
    const columns = (data.columns ?? []).map((col, i) => i === ci ? { ...col, heading } : col);
    onUpdate({ ...data, columns });
  };

  const addColumnLink = (ci: number) => {
    const columns = (data.columns ?? []).map((col, i) =>
      i === ci ? { ...col, links: [...col.links, { label: '', url: '' }] } : col
    );
    onUpdate({ ...data, columns });
  };

  const updateColumnLink = (ci: number, li: number, field: keyof FooterLink, value: string) => {
    const columns = (data.columns ?? []).map((col, i) =>
      i === ci
        ? { ...col, links: col.links.map((link, j) => j === li ? { ...link, [field]: value } : link) }
        : col
    );
    onUpdate({ ...data, columns });
  };

  const removeColumnLink = (ci: number, li: number) => {
    const columns = (data.columns ?? []).map((col, i) =>
      i === ci ? { ...col, links: col.links.filter((_, j) => j !== li) } : col
    );
    onUpdate({ ...data, columns });
  };

  return (
    <div className="space-y-4">
      {/* レイアウト */}
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">レイアウト</label>
        <div className="flex gap-2">
          {([
            { value: 'minimal', label: 'ミニマル' },
            { value: 'columns', label: 'カラム' },
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

      {/* リンク（minimal のみ） */}
      {variant === 'minimal' && (
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
                  placeholder="例：利用規約"
                  className={inputClass}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(i, 'url', e.target.value)}
                  placeholder="https://example.com/terms"
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
      )}

      {/* カラム（columns のみ） */}
      {variant === 'columns' && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">カラム</span>
            <button onClick={addColumn} className="text-xs text-blue-500 hover:text-blue-700">
              + カラム追加
            </button>
          </div>
          <div className="space-y-3">
            {(data.columns ?? []).map((col, ci) => (
              <div key={ci} className="rounded-lg border border-gray-200 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">カラム {ci + 1}</span>
                  <button onClick={() => removeColumn(ci)} className="text-xs text-red-400 hover:text-red-600">削除</button>
                </div>
                <input
                  type="text"
                  value={col.heading}
                  onChange={(e) => updateColumnHeading(ci, e.target.value)}
                  placeholder="見出し（例：サービス）"
                  className={`${inputClass} mb-2`}
                />
                <div className="space-y-1.5">
                  {col.links.map((link, li) => (
                    <div key={li} className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateColumnLink(ci, li, 'label', e.target.value)}
                        placeholder="ラベル"
                        className={inputClass}
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateColumnLink(ci, li, 'url', e.target.value)}
                        placeholder="URL"
                        className={inputClass}
                      />
                      <button onClick={() => removeColumnLink(ci, li)} className="shrink-0 text-xs text-red-400 hover:text-red-600">✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addColumnLink(ci)} className="mt-2 text-xs text-blue-500 hover:text-blue-700">
                  + リンク追加
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
