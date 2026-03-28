'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

type Props = {
  email: string;
  isOAuthUser: boolean;
  upgradeResult?: string;
  plan: 'free' | 'pro' | 'enterprise';
  hasStripeCustomer: boolean;
  subscriptionStatus: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

// --- 共通UIパーツ ---

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 disabled:bg-gray-50 disabled:text-gray-400"
    />
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <p className="mt-3 text-xs font-medium text-green-600">{message}</p>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="mt-3 text-xs font-medium text-red-600">{message}</p>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-4 rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
    >
      {loading ? '保存中…' : label}
    </button>
  );
}

// --- メールアドレス変更 ---

function EmailForm({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '更新に失敗しました');
      } else {
        setSuccess('メールアドレスを更新しました。次回ログイン時から新しいアドレスが適用されます。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="メールアドレス">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </FormField>
      {success && <SuccessMessage message={success} />}
      {error && <ErrorMessage message={error} />}
      <SubmitButton loading={loading} label="変更を保存" />
    </form>
  );
}

// --- パスワード変更 ---

function PasswordForm() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    if (form.newPassword !== form.confirmPassword) {
      setError('新しいパスワードが一致しません');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? '更新に失敗しました');
      } else {
        setSuccess('パスワードを更新しました');
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="現在のパスワード">
        <Input
          type="password"
          value={form.currentPassword}
          onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))}
          required
        />
      </FormField>
      <FormField label="新しいパスワード">
        <Input
          type="password"
          value={form.newPassword}
          onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))}
          required
        />
      </FormField>
      <FormField label="新しいパスワード（確認）">
        <Input
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          required
        />
      </FormField>
      {success && <SuccessMessage message={success} />}
      {error && <ErrorMessage message={error} />}
      <SubmitButton loading={loading} label="パスワードを変更" />
    </form>
  );
}

// --- プラン管理 ---

function PlanSection({
  plan,
  hasStripeCustomer,
  subscriptionStatus,
  currentPeriodEnd,
  cancelAtPeriodEnd,
}: {
  plan: 'free' | 'pro' | 'enterprise';
  hasStripeCustomer: boolean;
  subscriptionStatus: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const periodEndStr = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            {plan === 'free' ? '無料プラン' : plan === 'pro' ? 'Proプラン' : 'Enterpriseプラン'}
          </p>
          {plan === 'pro' && cancelAtPeriodEnd && periodEndStr && (
            <p className="mt-0.5 text-xs text-amber-600">
              {periodEndStr} に解約予定（それまでProプランを継続）
            </p>
          )}
          {plan === 'pro' && subscriptionStatus === 'past_due' && (
            <p className="mt-0.5 text-xs text-red-600">
              支払いに失敗しています。お支払い情報を確認してください。
            </p>
          )}
          {plan === 'pro' && !cancelAtPeriodEnd && periodEndStr && (
            <p className="mt-0.5 text-xs text-gray-400">次回更新: {periodEndStr}</p>
          )}
        </div>
        {plan === 'free' ? (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="rounded-lg bg-gray-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? '処理中…' : 'Proにアップグレード'}
          </button>
        ) : hasStripeCustomer ? (
          <button
            onClick={handlePortal}
            disabled={loading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            {loading ? '処理中…' : 'プランを管理'}
          </button>
        ) : null}
      </div>
      {plan === 'free' && (
        <p className="text-xs text-gray-400">
          Proプランでは AIクレジット無制限・公開LP無制限・独自ドメインが利用できます。
        </p>
      )}
    </div>
  );
}

// --- アカウント削除 ---

function DeleteAccountSection() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/me', { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? '削除に失敗しました');
        return;
      }
      await signOut({ callbackUrl: '/login' });
    } finally {
      setLoading(false);
    }
  };

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        アカウントを削除する
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <p className="mb-1 text-sm font-semibold text-red-800">本当に削除しますか？</p>
      <p className="mb-4 text-xs text-red-700">
        全てのプロジェクト・LP・アップロードデータが削除されます。この操作は取り消せません。
        確認のため <strong>「削除する」</strong> と入力してください。
      </p>
      <Input
        type="text"
        placeholder="削除する"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {error && <ErrorMessage message={error} />}
      <div className="mt-3 flex gap-2">
        <button
          onClick={handleDelete}
          disabled={input !== '削除する' || loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-40"
        >
          {loading ? '削除中…' : '削除する'}
        </button>
        <button
          onClick={() => { setConfirming(false); setInput(''); }}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
}

// --- メインページ ---

export default function SettingsPage({ email, isOAuthUser, upgradeResult, plan, hasStripeCustomer, subscriptionStatus, currentPeriodEnd, cancelAtPeriodEnd }: Props) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          ダッシュボードへ戻る
        </Link>
        <h1 className="mt-3 text-xl font-bold text-gray-900">アカウント設定</h1>
      </div>

      {upgradeResult === 'success' && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Proプランへのアップグレードが完了しました！
        </div>
      )}
      {upgradeResult === 'cancelled' && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          アップグレードがキャンセルされました。
        </div>
      )}

      <div className="space-y-4">
        <SectionCard title="メールアドレス">
          <EmailForm currentEmail={email} />
        </SectionCard>

        {isOAuthUser ? (
          <SectionCard title="パスワード">
            <p className="text-sm text-gray-500">
              Google アカウントでログインしているため、パスワードの変更はできません。
            </p>
          </SectionCard>
        ) : (
          <SectionCard title="パスワード">
            <PasswordForm />
          </SectionCard>
        )}

        <SectionCard title="プラン">
          <PlanSection
            plan={plan}
            hasStripeCustomer={hasStripeCustomer}
            subscriptionStatus={subscriptionStatus}
            currentPeriodEnd={currentPeriodEnd}
            cancelAtPeriodEnd={cancelAtPeriodEnd}
          />
        </SectionCard>

        <SectionCard title="アカウント削除">
          <p className="mb-4 text-sm text-gray-500">
            アカウントを削除すると、全てのデータが完全に削除されます。
          </p>
          <DeleteAccountSection />
        </SectionCard>
      </div>
    </div>
  );
}
