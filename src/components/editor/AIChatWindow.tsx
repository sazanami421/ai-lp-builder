'use client';

import { useState } from 'react';
import { Section } from '@/types/section';

type Props = {
  selectedSection: Section | null;
  onApply: (updated: Section) => void;
};

export default function AIChatWindow({ selectedSection, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  // TODO: AI チャットフロー実装（指示→差分提案→適用）
  return (
    <>
      <button
        className="fixed bottom-6 right-6 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg"
        onClick={() => setOpen((v) => !v)}
      >
        AI
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 w-80 rounded-lg border bg-white p-4 shadow-xl">
          <p className="mb-2 text-sm font-semibold">
            {selectedSection ? `${selectedSection.type} を編集` : 'セクションを選択してください'}
          </p>
          <textarea
            className="w-full rounded border p-2 text-sm"
            rows={3}
            placeholder="AIへの指示を入力…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="mt-2 w-full rounded bg-blue-600 py-2 text-sm text-white disabled:opacity-40"
            disabled={!selectedSection || !message}
          >
            送信
          </button>
        </div>
      )}
    </>
  );
}
