'use client';

import { useEffect } from 'react';
import { SectionType } from '@/types/section';

const SECTION_OPTIONS: { type: SectionType; label: string; description: string; icon: string }[] = [
  { type: 'hero',         label: 'Hero',         description: 'メインビジュアル・キャッチコピー',   icon: '🖼️' },
  { type: 'features',     label: 'Features',     description: '特徴・機能の紹介カード',             icon: '✨' },
  { type: 'testimonials', label: 'Testimonials', description: 'お客様の声・レビュー',               icon: '💬' },
  { type: 'pricing',      label: 'Pricing',      description: '料金プラン比較',                     icon: '💳' },
  { type: 'faq',          label: 'FAQ',          description: 'よくある質問とその回答',             icon: '❓' },
  { type: 'cta',          label: 'CTA',          description: '行動喚起ボタン・コンバージョン',     icon: '🚀' },
  { type: 'form',         label: 'Form',         description: 'お問い合わせ・リード獲得フォーム',   icon: '📝' },
  { type: 'footer',       label: 'Footer',       description: 'フッター・著作権・リンク',           icon: '📄' },
];

type Props = {
  onSelect: (type: SectionType) => void;
  onClose: () => void;
  loading: boolean;
};

export default function AddSectionModal({ onSelect, onClose, loading }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">セクションを追加</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          {SECTION_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => onSelect(option.type)}
              disabled={loading}
              className="flex w-full items-center gap-4 rounded-xl border border-gray-200 px-4 py-3 text-left transition hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50"
            >
              <span className="text-2xl">{option.icon}</span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                <p className="text-xs text-gray-400">{option.description}</p>
              </div>
              {loading && <span className="ml-auto text-xs text-gray-400">追加中…</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
