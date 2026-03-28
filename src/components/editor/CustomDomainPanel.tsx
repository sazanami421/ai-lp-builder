'use client';

import { useState } from 'react';

type Props = {
  pageId: string;
  plan: 'free' | 'pro' | 'enterprise';
  initialDomain: string | null;
  initialVerified: boolean;
  onVerifiedDomainChange?: (domain: string | null) => void;
};

export default function CustomDomainPanel({ pageId, plan, initialDomain, initialVerified, onVerifiedDomainChange }: Props) {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState(initialDomain ?? '');
  const [savedDomain, setSavedDomain] = useState(initialDomain);
  const [verified, setVerified] = useState(initialVerified);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');

  const isPro = plan !== 'free';

  async function handleSave() {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, domain: input.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '設定に失敗しました');
        return;
      }
      setSavedDomain(input.trim());
      setDomain(input.trim());
      setVerified(false);
      setInput('');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!savedDomain) return;
    setError('');
    setVerifying(true);
    try {
      const res = await fetch(`/api/domains/${encodeURIComponent(savedDomain)}/verify`);
      const data = await res.json();
      if (data.verified) {
        setVerified(true);
        onVerifiedDomainChange?.(savedDomain);
      } else {
        setError(data.reason ?? 'DNS未確認です');
      }
    } finally {
      setVerifying(false);
    }
  }

  async function handleDelete() {
    if (!savedDomain) return;
    if (!window.confirm(`ドメイン「${savedDomain}」の設定を削除しますか？`)) return;
    setLoading(true);
    try {
      await fetch(`/api/domains/${encodeURIComponent(savedDomain)}`, { method: 'DELETE' });
      setSavedDomain(null);
      setDomain('');
      setVerified(false);
      setInput('');
      onVerifiedDomainChange?.(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
          savedDomain && verified
            ? 'border-green-300 bg-green-50 text-green-700'
            : savedDomain
            ? 'border-amber-300 bg-amber-50 text-amber-700'
            : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
        }`}
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        {savedDomain ? (verified ? '独自ドメイン ✓' : '独自ドメイン（DNS未確認）') : 'ドメイン設定'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-40 w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <p className="mb-3 text-xs font-semibold text-gray-700">独自ドメイン設定</p>

            {!isPro && !savedDomain ? (
              <div className="rounded-lg bg-violet-50 px-3 py-3 text-xs text-violet-700">
                独自ドメインは <span className="font-semibold">Proプラン</span> の機能です。
                <button
                  onClick={async () => {
                    setOpen(false);
                    const res = await fetch('/api/stripe/checkout', { method: 'POST' });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }}
                  className="ml-1 underline hover:text-violet-900"
                >
                  アップグレード →
                </button>
              </div>
            ) : !isPro && savedDomain ? (
              <>
                <div className="mb-3 rounded-lg bg-red-50 px-3 py-2.5 text-xs text-red-700">
                  <p className="font-semibold">Proプラン専用の機能です</p>
                  <p className="mt-0.5">独自ドメインの設定を削除してください。削除するまでドメインは機能しません。</p>
                </div>
                <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-100 px-3 py-2">
                  <span className="text-xs font-medium text-gray-700">{savedDomain}</span>
                </div>
                {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {loading ? '削除中…' : 'ドメインを削除'}
                </button>
              </>
            ) : savedDomain ? (
              <>
                <div className={`mb-3 flex items-center justify-between rounded-lg px-3 py-2 ${
                  verified ? 'bg-green-50' : 'bg-amber-50'
                }`}>
                  <span className={`text-xs font-medium ${verified ? 'text-green-700' : 'text-amber-700'}`}>
                    {savedDomain}
                  </span>
                  <span className={`text-[10px] font-semibold ${verified ? 'text-green-600' : 'text-amber-600'}`}>
                    {verified ? '検証済み ✓' : 'DNS未確認'}
                  </span>
                </div>

                {!verified && (
                  <div className="mb-3 rounded-lg bg-gray-50 px-3 py-2.5 text-xs text-gray-600">
                    <p className="mb-1 font-medium text-gray-700">DNS設定手順</p>
                    {savedDomain.split('.').length === 2 ? (
                      // ルートドメイン → Aレコード
                      <>
                        <p>ルートドメインのためAレコードを設定してください：</p>
                        <div className="mt-2 space-y-1 rounded bg-white px-2 py-1.5 text-[10px] text-gray-800 border border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-gray-400">レコード種別</span>
                            <span className="font-mono font-medium">A</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">ホスト名</span>
                            <span className="font-mono font-medium">@</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">VALUE</span>
                            <span className="font-mono font-medium text-blue-600">76.76.21.21</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[10px] text-gray-400">※ DNS反映まで数時間かかる場合があります</p>
                      </>
                    ) : (
                      // サブドメイン → CNAMEレコード
                      <>
                        <p>以下のCNAMEレコードを追加してください：</p>
                        <div className="mt-2 space-y-1 rounded bg-white px-2 py-1.5 text-[10px] text-gray-800 border border-gray-200">
                          <div className="flex justify-between">
                            <span className="text-gray-400">レコード種別</span>
                            <span className="font-mono font-medium">CNAME</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">ホスト名</span>
                            <span className="font-mono font-medium">{savedDomain.split('.')[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">VALUE</span>
                            <span className="font-mono font-medium text-blue-600">cname.vercel-dns.com</span>
                          </div>
                        </div>
                        <p className="mt-2 text-[10px] text-gray-400">※ DNS反映まで数時間かかる場合があります</p>
                      </>
                    )}
                  </div>
                )}

                {error && <p className="mb-2 text-xs text-red-600">{error}</p>}

                <div className="flex gap-2">
                  {!verified && (
                    <button
                      onClick={handleVerify}
                      disabled={verifying}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {verifying ? '確認中…' : 'DNS確認'}
                    </button>
                  )}
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    削除
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-2 text-xs text-gray-500">
                  独自ドメインを入力してください（例: lp.example.com）
                </p>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="lp.example.com"
                  className="mb-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
                <button
                  onClick={handleSave}
                  disabled={loading || !input.trim()}
                  className="w-full rounded-lg bg-gray-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? '設定中…' : '設定する'}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
