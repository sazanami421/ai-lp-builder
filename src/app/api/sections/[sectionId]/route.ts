import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ sectionId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { sectionId } = await params;
    const body = await req.json();

    // セクションがログインユーザーのものか確認
    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        page: { project: { userId: session.user.id } },
      },
    });

    if (!section) {
      return NextResponse.json({ error: 'セクションが見つかりません' }, { status: 404 });
    }

    const updateFields: Record<string, unknown> = {};
    if ('data' in body) updateFields.data = body.data;
    if ('visible' in body) updateFields.visible = body.visible;

    const updated = await prisma.section.update({
      where: { id: sectionId },
      data: updateFields,
    });

    return NextResponse.json({ section: updated });
  } catch (err) {
    console.error('[PATCH /api/sections/:id]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { sectionId } = await params;

    const section = await prisma.section.findFirst({
      where: {
        id: sectionId,
        page: { project: { userId: session.user.id } },
      },
    });

    if (!section) {
      return NextResponse.json({ error: 'セクションが見つかりません' }, { status: 404 });
    }

    await prisma.section.delete({ where: { id: sectionId } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/sections/:id]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
