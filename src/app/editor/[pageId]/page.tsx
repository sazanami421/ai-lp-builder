import { getServerSession } from 'next-auth';
import { redirect, notFound } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PLAN_LIMITS } from '@/lib/plans';
import EditorShell from '@/components/editor/EditorShell';

type Props = {
  params: Promise<{ pageId: string }>;
};

export default async function EditorPage({ params }: Props) {
  const { pageId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect('/login');

  // pageId はプロジェクト ID として扱い、最初のページを取得
  const project = await prisma.project.findFirst({
    where: { id: pageId, userId: session.user.id },
    include: {
      pages: {
        include: {
          sections: { orderBy: { order: 'asc' } },
          _count: { select: { formSubmissions: true } },
        },
        take: 1,
      },
    },
  });

  if (!project) notFound();

  // ページがなければ初期ページを作成
  let page = project.pages[0];
  if (!page) {
    page = await prisma.page.create({
      data: {
        projectId: project.id,
        title: project.name,
        globalConfig: {},
      },
      include: {
        sections: { orderBy: { order: 'asc' } },
        _count: { select: { formSubmissions: true } },
      },
    });
  }

  const submissionCount = project.pages.reduce(
    (sum, p) => sum + p._count.formSubmissions,
    0
  );

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
    <EditorShell
      project={{ id: project.id, name: project.name, slug: project.slug, submissionCount }}
      page={{ id: page.id, title: page.title, globalConfig: page.globalConfig, isPublished: page.isPublished }}
      initialSections={page.sections.map((s) => ({
        ...s,
        styleOverrides: (s.styleOverrides ?? {}) as Record<string, string>,
      }))}
      planInfo={planInfo}
    />
  );
}
