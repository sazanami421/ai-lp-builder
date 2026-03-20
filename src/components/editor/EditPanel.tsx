'use client';

import { Section } from '@/types/section';

type Props = {
  section: Section | null;
  onChange: (updated: Section) => void;
};

export default function EditPanel({ section, onChange }: Props) {
  if (!section) {
    return <div className="p-4 text-sm text-gray-400">セクションを選択してください</div>;
  }

  // TODO: section.type に応じた編集フォームを表示
  return (
    <div className="p-4">
      <h2 className="mb-2 font-semibold">{section.type} の編集</h2>
      {/* フィールド実装予定 */}
    </div>
  );
}
