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
    const { orders } = await req.json() as { orders: { id: string; order: number }[] };

    // 全セクションがログインユーザーのものか確認
    const sections = await prisma.section.findMany({
      where: {
        id: { in: orders.map((o) => o.id) },
        page: { project: { userId: session.user.id } },
      },
      select: { id: true },
    });

    if (sections.length !== orders.length) {
      return NextResponse.json({ error: '不正なセクションIDが含まれています' }, { status: 403 });
    }

    await prisma.$transaction(
      orders.map(({ id, order }) =>
        prisma.section.update({ where: { id }, data: { order } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/sections/reorder]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
