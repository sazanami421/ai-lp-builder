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

  // Google OAuth ユーザーかどうか（パスワード変更フォームの表示制御）
  const account = await prisma.account.findFirst({
    where: { userId: session!.user.id, provider: 'google' },
    select: { id: true },
  });
  const isOAuthUser = !!account;

  return (
    <SettingsPage
      email={session!.user.email ?? ''}
      isOAuthUser={isOAuthUser}
      upgradeResult={params.upgrade}
    />
  );
}
