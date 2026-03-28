import { prisma } from '@/lib/prisma';
import { PaymentRequired } from '@/lib/errors';

// ========================================
// プラン設定（ここを変えるだけで全APIに反映）
// ========================================

export const PLAN_LIMITS = {
  free: {
    aiCreditsPerMonth: 20,
    publishedPages: 2,
    storageBytes: 50 * 1024 * 1024, // 50MB
  },
  pro: {
    aiCreditsPerMonth: Infinity,
    publishedPages: Infinity,
    storageBytes: Infinity, // 2GB（Supabase側で制御）
  },
  enterprise: {
    aiCreditsPerMonth: Infinity,
    publishedPages: Infinity,
    storageBytes: Infinity,
  },
} as const;

export const AI_CREDIT_COST = {
  generate: 3,
  chat: 1,
} as const;

// ========================================
// クレジットチェック＆消費ヘルパー
// ========================================

/**
 * AIクレジットを確認して消費する。
 * 上限超過時は PaymentRequired を throw。
 * 月が変わっていた場合は自動リセット。
 */
export async function consumeAICredits(
  userId: string,
  cost: number
): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { plan: true, aiCreditsUsed: true, aiCreditsResetAt: true },
  });

  const limit = PLAN_LIMITS[user.plan].aiCreditsPerMonth;

  // Pro / enterprise は無制限
  if (limit === Infinity) return;

  // 月が変わっていたらリセット
  const now = new Date();
  const resetAt = new Date(user.aiCreditsResetAt);
  const isNewMonth =
    now.getFullYear() !== resetAt.getFullYear() ||
    now.getMonth() !== resetAt.getMonth();

  const currentUsed = isNewMonth ? 0 : user.aiCreditsUsed;

  if (currentUsed + cost > limit) {
    throw PaymentRequired(
      `AIクレジットの上限（月${limit}pt）に達しました。Proプランにアップグレードしてください。`
    );
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      aiCreditsUsed: currentUsed + cost,
      ...(isNewMonth ? { aiCreditsResetAt: now } : {}),
    },
  });
}

/**
 * ストレージ使用量を確認する。
 * アップロード後に上限を超える場合は PaymentRequired を throw。
 */
export async function checkStorageLimit(
  userId: string,
  incomingBytes: number
): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { plan: true },
  });

  const limit = PLAN_LIMITS[user.plan].storageBytes;
  if (limit === Infinity) return;

  const { _sum } = await prisma.asset.aggregate({
    where: { userId },
    _sum: { size: true },
  });

  const usedBytes = _sum.size ?? 0;
  if (usedBytes + incomingBytes > limit) {
    const limitMB = Math.round(limit / 1024 / 1024);
    throw PaymentRequired(
      `ストレージの上限（無料プラン ${limitMB}MB）に達しました。Proプランにアップグレードしてください。`
    );
  }
}

/**
 * 公開LP数を確認する。
 * 上限超過時は PaymentRequired を throw。
 */
export async function checkPublishedPagesLimit(userId: string): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { plan: true },
  });

  const limit = PLAN_LIMITS[user.plan].publishedPages;
  if (limit === Infinity) return;

  const publishedCount = await prisma.page.count({
    where: {
      isPublished: true,
      project: { userId },
    },
  });

  if (publishedCount >= limit) {
    throw PaymentRequired(
      `公開できるLPは無料プランでは${limit}件までです。Proプランにアップグレードしてください。`
    );
  }
}
