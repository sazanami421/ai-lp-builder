'use client';

import { useState } from 'react';

export type PlanInfo = {
  plan: 'free' | 'pro' | 'enterprise';
  aiCreditsUsed: number;
  aiCreditsLimit: number | null;
  publishedPages: number;
  publishedPagesLimit: number | null;
  storageUsedBytes: number;
  storageLimitBytes: number | null;
  // Proプラン用サブスクリプション情報
  subscriptionStatus: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

const PLAN_LABEL: Record<string, string> = {
  free: 'Freeプラン',
  pro: 'Proプラン',
  enterprise: 'Enterpriseプラン',
};

function UsageRow({
  label,
  used,
  limit,
  unit,
}: {
  label: string;
  used: number;
  limit: number | null;
  unit: string;
}) {
  const isUnlimited = limit === null;
  const pct = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isWarning = !isUnlimited && pct >= 80;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-500">{label}</span>
        <span className={isWarning ? 'font-medium text-amber-600' : 'text-gray-400'}>
          {isUnlimited ? '無制限' : `${used}${unit} / ${limit}${unit}`}
        </span>
      </div>
      {!isUnlimited && (
        <div className="h-1 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              backgroundColor: isWarning ? '#F59E0B' : '#111827',
            }}
          />
        </div>
      )}
    </div>
  );
}

export function PlanMenuSection({ planInfo }: { planInfo: PlanInfo }) {
  const [loading, setLoading] = useState(false);
  const storageUsedMB = planInfo.storageUsedBytes / 1024 / 1024;
  const storageLimitMB = planInfo.storageLimitBytes !== null
    ? planInfo.storageLimitBytes / 1024 / 1024
    : null;

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? 'エラーが発生しました');
      }
    } finally {
      setLoading(false);
    }
  }

  const isPastDue = planInfo.subscriptionStatus === 'past_due';
  const isCancelling = planInfo.plan !== 'free' && planInfo.cancelAtPeriodEnd;
  const periodEndStr = planInfo.currentPeriodEnd
    ? new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric' }).format(
        new Date(planInfo.currentPeriodEnd)
      )
    : null;

  return (
    <div className="border-b border-gray-100 px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700">{PLAN_LABEL[planInfo.plan]}</span>
        {planInfo.plan === 'free' && (
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="text-xs font-medium text-violet-600 transition hover:text-violet-800 disabled:opacity-50"
          >
            {loading ? '処理中…' : 'アップグレード'}
          </button>
        )}
      </div>

      {/* 支払い失敗警告 */}
      {isPastDue && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          支払いに失敗しました。お支払い方法を更新してください。
        </div>
      )}

      {/* 解約予約中 */}
      {isCancelling && periodEndStr && (
        <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {periodEndStr}に自動更新が停止します。
        </div>
      )}

      {/* 次回請求日（通常のProプラン） */}
      {!isCancelling && !isPastDue && planInfo.plan !== 'free' && periodEndStr && (
        <p className="text-xs text-gray-400">次回請求日: {periodEndStr}</p>
      )}

      <UsageRow
        label="AIクレジット"
        used={planInfo.aiCreditsUsed}
        limit={planInfo.aiCreditsLimit}
        unit="pt"
      />
      <UsageRow
        label="公開LP"
        used={planInfo.publishedPages}
        limit={planInfo.publishedPagesLimit}
        unit="件"
      />
      <UsageRow
        label="ストレージ"
        used={Math.round(storageUsedMB * 10) / 10}
        limit={storageLimitMB !== null ? Math.round(storageLimitMB) : null}
        unit="MB"
      />
    </div>
  );
}
