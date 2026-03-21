'use client';

import { useState } from 'react';
import { SectionItem } from './SectionList';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { SectionType, GlobalConfig } from '@/types/section';
import { TEMPLATES } from '@/lib/templates';

type Props = {
  sections: SectionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAIClick: (sectionId: string) => void;
  projectName: string;
  template: GlobalConfig['template'];
  cssVars: Record<string, string>;
  pageId: string;
  projectSlug: string;
  initialIsPublished: boolean;
};

export default function Preview({ sections, selectedId, onSelect, onAIClick, projectName, template, cssVars, pageId, projectSlug, initialIsPublished }: Props) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [updating, setUpdating] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [justPushed, setJustPushed] = useState(false);

  const handleStatusChange = async (publish: boolean) => {
    setUpdating(true);
    try {
      await fetch(`/api/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: publish }),
      });
      setIsPublished(publish);
      setJustPushed(false);
    } finally {
      setUpdating(false);
    }
  };

  const handlePushUpdate = async () => {
    setPushing(true);
    try {
      await fetch(`/api/pages/${pageId}/publish`, { method: 'POST' });
      setJustPushed(true);
    } finally {
      setPushing(false);
    }
  };

  const publicUrl = `/p/${projectSlug}`;

  const visible = sections
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order);

  // テンプレートのデフォルト変数にカスタム上書きをマージ
  const mergedVars = { ...TEMPLATES[template].cssVars, ...cssVars };
  const cssVarString = Object.entries(mergedVars).map(([k, v]) => `${k}: ${v};`).join(' ');

  const FONT_URLS: Record<string, string> = {
    simple:   'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap',
    premium:  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap',
    pop:      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap',
    business: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
  };

  return (
    <div className="flex h-full flex-col">
      {/* ツールバー */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex gap-1">
          {(['desktop', 'mobile'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                device === d
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {d === 'desktop' ? 'Desktop' : 'Mobile'}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{projectName}</span>
        <div className="flex items-center gap-2">
          {isPublished && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 underline transition hover:text-blue-700"
            >
              公開URLを開く ↗
            </a>
          )}
          {isPublished && (
            <button
              onClick={handlePushUpdate}
              disabled={pushing}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition disabled:opacity-60 ${
                justPushed ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {pushing ? '反映中…' : justPushed ? '反映済み ✓' : '更新を公開'}
            </button>
          )}
          <select
            value={isPublished ? 'published' : 'draft'}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value === 'published')}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold outline-none transition disabled:opacity-60 ${
              isPublished
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            <option value="draft">下書き</option>
            <option value="published">公開中</option>
          </select>
        </div>
      </div>

      {/* プレビュー本体 */}
      <div className="flex flex-1 justify-center overflow-y-auto bg-gray-100 p-6">
        <link rel="stylesheet" href={FONT_URLS[template]} />
        <style>{`.lp-preview { ${cssVarString} }`}</style>

        <div
          className={`lp-preview h-fit overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all ${
            device === 'mobile' ? 'w-[390px]' : 'w-full max-w-3xl'
          }`}
        >
          {visible.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-gray-400">
              セクションを追加してください
            </div>
          ) : (
            visible.map((section) => (
              <div
                key={section.id}
                onClick={() => onSelect(section.id)}
                className={`group relative cursor-pointer outline outline-2 outline-offset-[-2px] transition ${
                  selectedId === section.id
                    ? 'outline-blue-500'
                    : 'outline-transparent hover:outline-blue-200'
                }`}
              >
                <SectionRenderer
                  type={section.type as SectionType}
                  data={section.data}
                  styleOverrides={section.styleOverrides}
                />
                {/* セクションごとの AI ボタン */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAIClick(section.id);
                  }}
                  title="AIに編集を依頼"
                  className={`absolute right-3 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700 hover:scale-110 ${
                    selectedId === section.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
