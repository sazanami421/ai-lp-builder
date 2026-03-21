import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { pageId, type } = await req.json();

    if (!pageId || !type) {
      return NextResponse.json({ error: 'pageId と type は必須です' }, { status: 400 });
    }

    // ページがログインユーザーのものか確認
    const page = await prisma.page.findFirst({
      where: {
        id: pageId,
        project: { userId: session.user.id },
      },
      include: { sections: { select: { order: true } } },
    });

    if (!page) {
      return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 });
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
    console.error('[POST /api/sections]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
