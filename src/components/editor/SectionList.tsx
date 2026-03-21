'use client';

import { useRef, useState } from 'react';
import { SectionType } from '@/types/section';

const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero',
  features: 'Features',
  testimonials: 'Testimonials',
  pricing: 'Pricing',
  faq: 'FAQ',
  cta: 'CTA',
  form: 'Form',
  footer: 'Footer',
};

export type SectionItem = {
  id: string;
  type: SectionType;
  order: number;
  visible: boolean;
  data: unknown;
  styleOverrides: Record<string, string>;
};

type Props = {
  sections: SectionItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddClick: () => void;
  onReorder: (newSections: SectionItem[]) => void;
  onToggleVisible: (id: string, visible: boolean) => void;
  onDelete: (id: string) => void;
};

export default function SectionList({ sections, selectedId, onSelect, onAddClick, onReorder, onToggleVisible, onDelete }: Props) {
  const dragId = useRef<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    dragId.current = id;
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragId.current !== id) setOverId(id);
  };

  const handleDrop = (targetId: string) => {
    const fromId = dragId.current;
    dragId.current = null;
    setOverId(null);
    if (!fromId || fromId === targetId) return;

    const reordered = [...sections];
    const fromIdx = reordered.findIndex((s) => s.id === fromId);
    const toIdx = reordered.findIndex((s) => s.id === targetId);
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);

    onReorder(reordered.map((s, i) => ({ ...s, order: i })));
  };

  const handleDragEnd = () => {
    dragId.current = null;
    setOverId(null);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sections</span>
        <button
          onClick={onAddClick}
          className="flex h-6 w-6 items-center justify-center rounded-md text-lg leading-none text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          title="セクションを追加"
        >
          +
        </button>
      </div>

      <div className="overflow-y-auto py-1.5">
        {sections.length === 0 ? (
          <button
            onClick={onAddClick}
            className="mx-3 mt-2 flex w-[calc(100%-1.5rem)] items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 py-4 text-xs text-gray-400 transition hover:border-gray-300 hover:text-gray-500"
          >
            <span>+</span> セクションを追加
          </button>
        ) : (
          sections.map((section, i) => (
            <div
              key={section.id}
              draggable
              onDragStart={() => handleDragStart(section.id)}
              onDragOver={(e) => handleDragOver(e, section.id)}
              onDrop={() => handleDrop(section.id)}
              onDragEnd={handleDragEnd}
              className={`border-t-2 transition-colors ${
                overId === section.id ? 'border-blue-400' : 'border-transparent'
              }`}
            >
              <div
                className={`group flex w-full items-center gap-2 px-2 py-1.5 transition ${
                  selectedId === section.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {/* ドラッグハンドル */}
                <span className="cursor-grab text-gray-300 active:cursor-grabbing">
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="currentColor">
                    <circle cx="3" cy="3" r="1.5" />
                    <circle cx="7" cy="3" r="1.5" />
                    <circle cx="3" cy="8" r="1.5" />
                    <circle cx="7" cy="8" r="1.5" />
                    <circle cx="3" cy="13" r="1.5" />
                    <circle cx="7" cy="13" r="1.5" />
                  </svg>
                </span>

                {/* 番号 + ラベル（クリックで選択） */}
                <button
                  onClick={() => onSelect(section.id)}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold ${
                      selectedId === section.id
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={`text-sm ${!section.visible ? 'text-gray-400' : ''}`}>
                    {SECTION_LABELS[section.type]}
                  </span>
                </button>

                {/* 表示/非表示トグル */}
                <button
                  onClick={() => onToggleVisible(section.id, !section.visible)}
                  title={section.visible ? '非表示にする' : '表示する'}
                  className={`shrink-0 transition ${
                    section.visible
                      ? 'text-gray-300 opacity-0 group-hover:opacity-100 hover:text-gray-500'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {section.visible ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>

                {/* 削除ボタン */}
                <button
                  onClick={() => onDelete(section.id)}
                  title="削除"
                  className="shrink-0 text-gray-300 opacity-0 transition group-hover:opacity-100 hover:text-red-400"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
