import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ pageId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { pageId } = await params;
    const body = await req.json();

    // ページがログインユーザーのものか確認（プロジェクトのslugも取得）
    const page = await prisma.page.findFirst({
      where: { id: pageId, project: { userId: session.user.id } },
      include: { project: { select: { slug: true } } },
    });

    if (!page) {
      return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 });
    }

    const updateFields: Record<string, unknown> = {};
    if ('globalConfig' in body) updateFields.globalConfig = body.globalConfig;
    if ('title' in body) updateFields.title = body.title;
    if ('publishedAt' in body) updateFields.publishedAt = body.publishedAt;
    if ('isPublished' in body) {
      updateFields.isPublished = body.isPublished;
      if (body.isPublished && !page.publishedAt) {
        updateFields.publishedAt = new Date();
      }
    }

    const updated = await prisma.page.update({
      where: { id: pageId },
      data: updateFields,
    });

    // 公開状態の変更時はキャッシュを無効化
    if ('isPublished' in body) {
      revalidatePath(`/p/${page.project.slug}`);
    }

    return NextResponse.json({ page: updated });
  } catch (err) {
    console.error('[PATCH /api/pages/:id]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { pageId } = await params;

    const page = await prisma.page.findFirst({
      where: { id: pageId, project: { userId: session.user.id } },
    });

    if (!page) {
      return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 });
    }

    await prisma.page.delete({ where: { id: pageId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/pages/:id]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
