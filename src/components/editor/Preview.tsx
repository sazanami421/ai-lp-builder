'use client';

import { Section, GlobalConfig } from '@/types/section';

type Props = {
  sections: Section[];
  globalConfig: GlobalConfig;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function Preview({ sections, globalConfig, selectedId, onSelect }: Props) {
  // TODO: セクションレンダラーを組み合わせてプレビュー表示
  return (
    <div className="h-full overflow-y-auto bg-white">
      {sections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order)
        .map((section) => (
          <div
            key={section.id}
            className={`cursor-pointer outline outline-2 ${selectedId === section.id ? 'outline-blue-500' : 'outline-transparent hover:outline-blue-200'}`}
            onClick={() => onSelect(section.id)}
          >
            {/* TODO: セクションレンダラー */}
            <div className="p-8 text-center text-gray-400">[{section.type}]</div>
          </div>
        ))}
    </div>
  );
}
