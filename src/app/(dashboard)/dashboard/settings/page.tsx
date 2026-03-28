import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import SettingsPage from '@/components/dashboard/SettingsPage';

type Props = {
  searchParams: Promise<{ upgrade?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const session = await getServerSession(authOptions);
  const params = await searchParams;

  const [account, user] = await Promise.all([
    // Google OAuth ユーザーかどうか（パスワード変更フォームの表示制御）
    prisma.account.findFirst({
      where: { userId: session!.user.id, provider: 'google' },
      select: { id: true },
    }),
    prisma.user.findUniqueOrThrow({
      where: { id: session!.user.id },
      select: {
        plan: true,
        stripeCustomerId: true,
        subscriptionStatus: true,
        currentPeriodEnd: true,
        cancelAtPeriodEnd: true,
      },
    }),
  ]);

  return (
    <SettingsPage
      email={session!.user.email ?? ''}
      isOAuthUser={!!account}
      upgradeResult={params.upgrade}
      plan={user.plan}
      hasStripeCustomer={!!user.stripeCustomerId}
      subscriptionStatus={user.subscriptionStatus}
      currentPeriodEnd={user.currentPeriodEnd}
      cancelAtPeriodEnd={user.cancelAtPeriodEnd}
    />
  );
}
