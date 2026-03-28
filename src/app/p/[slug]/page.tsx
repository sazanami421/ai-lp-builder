import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { SectionType, GlobalConfig } from '@/types/section';
import { TEMPLATES } from '@/lib/templates';
import { PLAN_LIMITS } from '@/lib/plans';

type Props = {
  params: Promise<{ slug: string }>;
};

const FONT_URLS: Record<GlobalConfig['template'], string> = {
  simple:   'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap',
  premium:  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap',
  pop:      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap',
  business: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
  natural:  'https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Raleway:wght@300;400;500;600;700&display=swap',
};

function PlanLimitScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
          <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="mb-2 text-lg font-semibold text-gray-900">このページは現在表示できません</h1>
        <p className="text-sm text-gray-500">
          このランディングページは一時的に非公開になっています。
        </p>
      </div>
    </div>
  );
}

// revalidatePath() が呼ばれるまでキャッシュを保持（「更新を公開」ボタンで無効化）
export const revalidate = false;

export default async function PublicLPPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      user: { select: { plan: true } },
      pages: {
        where: { isPublished: true },
        include: {
          sections: {
            where: { visible: true },
            orderBy: { order: 'asc' },
          },
        },
        take: 1,
      },
    },
  });

  if (!project || project.pages.length === 0) notFound();

  // Freeプランの公開LP上限を超えている場合は閲覧不可画面
  const publishedPagesLimit = PLAN_LIMITS[project.user.plan].publishedPages;
  if (publishedPagesLimit !== Infinity) {
    const totalPublished = await prisma.page.count({
      where: { isPublished: true, project: { userId: project.userId } },
    });
    if (totalPublished > publishedPagesLimit) {
      return <PlanLimitScreen />;
    }
  }

  const page = project.pages[0];
  const globalConfig = page.globalConfig as { template?: string; cssVars?: Record<string, string> } | null;
  const templateKey = (globalConfig?.template && globalConfig.template in TEMPLATES
    ? globalConfig.template
    : 'simple') as GlobalConfig['template'];

  const mergedVars = { ...TEMPLATES[templateKey].cssVars, ...(globalConfig?.cssVars ?? {}) };
  const cssVarString = Object.entries(mergedVars).map(([k, v]) => `${k}: ${v};`).join(' ');

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href={FONT_URLS[templateKey]} />
      <style>{`
        .lp-preview { ${cssVarString} }
        .lp-preview * { box-sizing: border-box; }
      `}</style>
      <div className="lp-preview">
        {page.sections.map((section) => (
          <SectionRenderer
            key={section.id}
            type={section.type as SectionType}
            data={section.data}
            styleOverrides={section.styleOverrides as Record<string, string>}
            pageId={page.id}
          />
        ))}
      </div>
    </>
  );
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  return {
    title: project?.name ?? 'LP',
  };
}
