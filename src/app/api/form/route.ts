import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { pageId, data } = await req.json();

    if (!pageId || !data || typeof data !== 'object') {
      return NextResponse.json({ error: 'パラメータが不足しています' }, { status: 400 });
    }

    // ページが公開中か確認
    const page = await prisma.page.findFirst({
      where: { id: pageId, isPublished: true },
    });

    if (!page) {
      return NextResponse.json({ error: 'ページが見つかりません' }, { status: 404 });
    }

    await prisma.formSubmission.create({
      data: { pageId, data },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/form]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
