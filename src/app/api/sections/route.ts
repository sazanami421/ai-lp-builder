import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createSectionSchema, formatZodError } from '@/lib/validations';
import { handleApiError, NotFound } from '@/lib/errors';

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
      include: { sections: { select: { order: true } } },
    });

    if (!page) {
      throw NotFound('ページが見つかりません');
    }

    // 末尾に追加
    const maxOrder = page.sections.reduce((max, s) => Math.max(max, s.order), -1);

    const section = await prisma.section.create({
      data: {
        pageId,
        type,
        order: maxOrder + 1,
        visible: true,
        data: {},
        styleOverrides: {},
      },
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (err) {
    return handleApiError(err, 'POST /api/sections');
  }
}
