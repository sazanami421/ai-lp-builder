import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { updatePageSchema, formatZodError } from '@/lib/validations';

type Params = { params: Promise<{ pageId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { pageId } = await params;
    const body = await req.json();
    const parsed = updatePageSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: formatZodError(parsed.error) },
        { status: 400 }
      );
    }

    // ページがログインユーザーのものか確認（プロジェクトのslugも取得）
    const page = await prisma.page.findFirst({
      where: { id: pageId, project: { userId: session.user.id } },
      include: { project: { select: { slug: true } } },
    });

    if (!page) {
      return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 });
    }

    const updateFields: Record<string, unknown> = {};
    if (parsed.data.globalConfig !== undefined) updateFields.globalConfig = parsed.data.globalConfig;
    if (parsed.data.title !== undefined) updateFields.title = parsed.data.title;
    if (parsed.data.isPublished !== undefined) {
      updateFields.isPublished = parsed.data.isPublished;
      if (parsed.data.isPublished && !page.publishedAt) {
        updateFields.publishedAt = new Date();
      }
    }

    const updated = await prisma.page.update({
      where: { id: pageId },
      data: updateFields,
    });

    // 公開状態の変更時はキャッシュを無効化
    if (parsed.data.isPublished !== undefined) {
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
