import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reorderSchema, formatZodError } from '@/lib/validations';
import { handleApiError, Forbidden } from '@/lib/errors';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = reorderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    const { orders } = parsed.data;

    // 全セクションがログインユーザーのものか確認
    const sections = await prisma.section.findMany({
      where: {
        id: { in: orders.map((o) => o.id) },
        page: { project: { userId: session.user.id } },
      },
      select: { id: true },
    });

    if (sections.length !== orders.length) {
      throw Forbidden('不正なセクションIDが含まれています');
    }

    await prisma.$transaction(
      orders.map(({ id, order }) =>
        prisma.section.update({ where: { id }, data: { order } })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    return handleApiError(err, 'POST /api/sections/reorder');
  }
}
