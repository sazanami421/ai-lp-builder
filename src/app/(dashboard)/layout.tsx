import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PLAN_LIMITS } from '@/lib/plans';
import Header from '@/components/dashboard/Header';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  const [user, publishedCount, storageAgg] = await Promise.all([
    prisma.user.findUniqueOrThrow({
      where: { id: session.user.id },
      select: {
        plan: true,
        aiCreditsUsed: true,
        aiCreditsResetAt: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
    prisma.page.count({
      where: { isPublished: true, project: { userId: session.user.id } },
    }),
    prisma.asset.aggregate({
      where: { userId: session.user.id },
      _sum: { size: true },
    }),
  ]);

  const now = new Date();
  const resetAt = new Date(user.aiCreditsResetAt);
  const isNewMonth =
    now.getFullYear() !== resetAt.getFullYear() ||
    now.getMonth() !== resetAt.getMonth();
  const creditsUsed = isNewMonth ? 0 : user.aiCreditsUsed;

  const limits = PLAN_LIMITS[user.plan];
  const toLimit = (v: number) => (v === Infinity ? null : v);

  const planInfo = {
    plan: user.plan,
    aiCreditsUsed: creditsUsed,
    aiCreditsLimit: toLimit(limits.aiCreditsPerMonth),
    publishedPages: publishedCount,
    publishedPagesLimit: toLimit(limits.publishedPages),
    storageUsedBytes: storageAgg._sum.size ?? 0,
    storageLimitBytes: toLimit(limits.storageBytes),
    subscriptionStatus: user.subscriptionStatus,
    currentPeriodEnd: user.currentPeriodEnd,
    cancelAtPeriodEnd: user.cancelAtPeriodEnd,
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header
        userName={session.user?.name ?? null}
        userEmail={session.user?.email ?? null}
        userImage={session.user?.image ?? null}
        planInfo={planInfo}
      />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
