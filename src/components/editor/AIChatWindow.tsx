'use client';

import { useState, useRef, useEffect } from 'react';
import { SectionItem } from './SectionList';
import { SECTION_LABELS } from '@/lib/sectionLabels';

type Suggestion = {
  data: Record<string, unknown>;
  styleOverrides: Record<string, string>;
};

type Message =
  | { role: 'user'; text: string }
  | { role: 'assistant'; text: string; suggested?: Suggestion; isLimitError?: boolean };

type CreditInfo = {
  plan: string;
  aiCreditsRemaining: number;
  aiCreditsLimit: number;
  creditCost: { generate: number; chat: number };
};

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
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // セクション切り替え時にメッセージをリセット
  useEffect(() => {
    setMessages([]);
  }, [selectedSection?.id]);

  // 新しいメッセージが来たら末尾にスクロール
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // チャットを開いたときにクレジット情報を取得
  useEffect(() => {
    if (!open) return;
    fetch('/api/users/me')
      .then((r) => r.json())
      .then((data) => setCredits(data))
      .catch(() => {});
  }, [open]);

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

      if (res.status === 402) {
        setMessages((prev) => [...prev, { role: 'assistant', text: json.error ?? 'クレジット上限に達しました', isLimitError: true }]);
        return;
      }

      if (!res.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', text: json.error ?? 'エラーが発生しました' }]);
        return;
      }

      // クレジット残量を更新
      if (credits && credits.aiCreditsLimit !== Infinity) {
        setCredits((prev) => prev ? { ...prev, aiCreditsRemaining: Math.max(0, prev.aiCreditsRemaining - prev.creditCost.chat) } : prev);
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

  const isFree = credits?.plan === 'free';
  const remaining = credits?.aiCreditsRemaining ?? null;

  return (
    <>
      {open && (
        <div className="absolute bottom-4 right-4 z-20 flex w-80 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
          style={{ maxHeight: '480px' }}
        >
          {/* ヘッダー */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">AIアシスタント</span>
              {selectedSection && (
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                  {SECTION_LABELS[selectedSection.type]}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* 残クレジット表示（無料プランのみ） */}
              {isFree && remaining !== null && (
                <span className={`text-[10px] font-medium ${remaining <= 3 ? 'text-red-500' : 'text-gray-400'}`}>
                  残り {remaining}pt
                </span>
              )}
              <button
                onClick={() => onOpenChange(false)}
                className="rounded p-0.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
              >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
          </div>

          {/* メッセージ一覧 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-2">
                <div className="rounded-xl bg-gray-100 px-3 py-2 text-xs text-gray-600">
                  {selectedSection
                    ? `「${SECTION_LABELS[selectedSection.type]}」が選択されています。どのような変更をしますか？`
                    : 'セクションを選択してから指示を入力してください。'}
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-2 text-[11px] text-amber-700">
                  テキスト・色・レイアウトの変更が得意です。画像やフォーム設定などは手動編集をご利用ください。
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && msg.isLimitError ? (
                  // クレジット上限エラー専用UI
                  <div className="w-full rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                    <p className="text-xs font-semibold text-amber-800">AIクレジットの上限に達しました</p>
                    <p className="mt-0.5 text-[10px] text-amber-700">月20ptを使い切りました。Proプランで無制限に使えます。</p>
                    <a
                      href="#"
                      className="mt-2 block w-full rounded-lg bg-amber-500 py-1.5 text-center text-[11px] font-semibold text-white transition hover:bg-amber-600"
                    >
                      Proプランにアップグレード
                    </a>
                  </div>
                ) : (
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
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
