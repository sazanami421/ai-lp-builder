import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type Params = { params: Promise<{ pageId: string }> };

// 「更新を公開」— すでに公開中のページの最新内容を公開LPに反映する
export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { pageId } = await params;

    const page = await prisma.page.findFirst({
      where: { id: pageId, project: { userId: session.user.id } },
      include: { project: { select: { slug: true } } },
    });

    if (!page) {
      return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 });
    }

    if (!page.isPublished) {
      return NextResponse.json({ error: 'ページが公開されていません' }, { status: 400 });
    }

    // published_at を現在時刻に更新してキャッシュを無効化
    await prisma.page.update({
      where: { id: pageId },
      data: { publishedAt: new Date() },
    });

    revalidatePath(`/p/${page.project.slug}`);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/pages/:id/publish]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
