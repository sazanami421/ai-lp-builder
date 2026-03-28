import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSectionSchema, formatZodError } from '@/lib/validations';
import { handleApiError, NotFound } from '@/lib/errors';
import { TEMPLATES } from '@/lib/templates';
import { DEFAULT_SECTION_DATA } from '@/lib/defaultSectionData';
import type { GlobalConfig, SectionType } from '@/types/section';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createSectionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { pageId, type } = parsed.data;

    // ページがログインユーザーのものか確認
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        project: { userId: session.user.id },
      },
      select: {
        id: true,
        globalConfig: true,
        sections: { select: { order: true } },
      },
    });

    if (!page) {
      throw NotFound('ページが見つかりません');
    }

    // テンプレートの defaultVariants から variant を決定
    const globalConfig = page.globalConfig as GlobalConfig | null;
    const template = globalConfig?.template ?? 'simple';
    const defaultVariant = TEMPLATES[template].defaultVariants[type as SectionType];
    const initialData = {
      ...(DEFAULT_SECTION_DATA[type as SectionType] as Record<string, unknown>),
      variant: defaultVariant,
    };

    // 末尾に追加
    const maxOrder = page.sections.reduce((max, s) => Math.max(max, s.order), -1);

    const section = await prisma.section.create({
      data: {
        pageId,
        type,
        order: maxOrder + 1,
        visible: true,
        data: initialData,
        styleOverrides: {},
      },
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'POST /api/sections');
  }
}
