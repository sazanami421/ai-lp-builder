'use client';

import { useState, useRef, useEffect } from 'react';
import { SectionItem } from './SectionList';

type Suggestion = {
  data: Record<string, unknown>;
  styleOverrides: Record<string, string>;
};

type Message =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; suggested?: Suggestion };

type Props = {
  selectedSection: SectionItem | null;
  onApply: (sectionId: string, data: unknown, styleOverrides: Record<string, string>) => void;
  onPreview: (sectionId: string, data: unknown, styleOverrides: Record<string, string>) => void;
  onClearPreview: () => void;
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function AIChatWindow({ selectedSection, onApply, onPreview, onClearPreview, open, onOpenChange }: Props) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // セクション切り替え時にメッセージをリセット
  useEffect(() => {
    setMessages([]);
  }, [selectedSection?.id]);

  // 新しいメッセージが来たら末尾にスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!selectedSection || !input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    onClearPreview();
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: selectedSection.type,
          currentData: selectedSection.data,
          currentStyleOverrides: selectedSection.styleOverrides ?? {},
          message: userText,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', text: json.error ?? 'エラーが発生しました' }]);
        return;
      }

      const suggestion = { data: json.data, styleOverrides: json.styleOverrides ?? {} };
      if (selectedSection) {
        onPreview(selectedSection.id, suggestion.data, suggestion.styleOverrides);
      }
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'プレビューに反映しました。適用しますか？',
          suggested: suggestion,
        },
      ]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'ネットワークエラーが発生しました' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.shiftKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {open && (
        <div className="absolute bottom-4 right-4 z-20 flex w-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
          style={{ maxHeight: '480px' }}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div>
              <span className="text-sm font-semibold text-gray-900">AI assistant</span>
              {selectedSection && (
                <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                  {selectedSection.type}
                </span>
              )}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          </div>

          {/* メッセージ一覧 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-600">
                {selectedSection
                  ? `${selectedSection.type} セクションが選択されています。どのような変更をしますか？`
                  : 'セクションを選択してから指示を入力してください。'}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'assistant' && msg.suggested && selectedSection && (
                  <div className="mt-1.5 flex gap-2">
                    <button
                      onClick={() => {
                        onApply(selectedSection.id, msg.suggested!.data, msg.suggested!.styleOverrides);
                        setMessages((prev) =>
                          prev.map((m, j) =>
                            j === i ? { ...m, text: '適用しました！', suggested: undefined } : m
                          )
                        );
                      }}
                      className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      適用する
                    </button>
                    <button
                      onClick={() => {
                        onClearPreview();
                        setMessages((prev) =>
                          prev.map((m, j) =>
                            j === i ? { ...m, text: 'キャンセルしました', suggested: undefined } : m
                          )
                        );
                      }}
                      className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                      元に戻す
                    </button>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-start">
                <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-400">
                  生成中…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* 入力欄 */}
          <div className="flex gap-2 border-t border-gray-100 p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedSection ? '⌘Enter or Shift+Enter で送信' : 'セクションを選択してください'}
              disabled={!selectedSection || loading}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none transition focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!selectedSection || !input.trim() || loading}
              className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-40"
            >
              送信
            </button>
          </div>
        </div>
      )}

    </>
  );
}
