'use client';

import { CtaSectionData } from '@/types/section';

type Props = {
  data: CtaSectionData;
  onUpdate: (newData: CtaSectionData) => void;
};

const inputClass =
  'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-50';

export default function CtaForm({ data, onUpdate }: Props) {
  const set = (key: keyof CtaSectionData, value: string) => {
    onUpdate({ ...data, [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">見出し（必須）</label>
        <input
          type="text"
          value={data.headline ?? ''}
          onChange={(e) => set('headline', e.target.value)}
          placeholder="今すぐ無料で始めましょう"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">サブ見出し</label>
        <textarea
          rows={2}
          value={data.subheadline ?? ''}
          onChange={(e) => set('subheadline', e.target.value)}
          placeholder="補足テキストを入力"
          className={`${inputClass} resize-none`}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">ボタン テキスト</label>
        <input
          type="text"
          value={data.ctaText ?? ''}
          onChange={(e) => set('ctaText', e.target.value)}
          placeholder="無料でアカウント作成"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">ボタン URL</label>
        <input
          type="url"
          value={data.ctaUrl ?? ''}
          onChange={(e) => set('ctaUrl', e.target.value)}
          placeholder="https://example.com"
          className={inputClass}
        />
      </div>
    </div>
  );
}
