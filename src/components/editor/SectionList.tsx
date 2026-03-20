'use client';

import { Section } from '@/types/section';

type Props = {
  sections: Section[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onReorder: (sections: Section[]) => void;
};

export default function SectionList({ sections, selectedId, onSelect, onReorder }: Props) {
  // TODO: ドラッグ並び替え実装
  return (
    <ul className="flex flex-col gap-1">
      {sections.map((section) => (
        <li
          key={section.id}
          className={`cursor-pointer rounded px-3 py-2 text-sm ${selectedId === section.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => onSelect(section.id)}
        >
          {section.type}
        </li>
      ))}
    </ul>
  );
}
