import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SectionRenderer from '@/components/sections/SectionRenderer';
import { SectionType, GlobalConfig } from '@/types/section';
import { TEMPLATES } from '@/lib/templates';

type Props = {
  params: Promise<{ slug: string }>;
};

const FONT_URLS: Record<GlobalConfig['template'], string> = {
  simple:   'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap',
  premium:  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap',
  pop:      'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap',
  business: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap',
};

export default async function PublicLPPage({ params }: Props) {
  const { slug } = await params;

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
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
        .lp-root { ${cssVarString} }
        .lp-root * { box-sizing: border-box; }
      `}</style>
      <div className="lp-root">
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
