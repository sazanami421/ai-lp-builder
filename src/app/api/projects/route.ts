import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// スラッグ生成：日本語も含む名前をローマ字 or ランダム文字列に変換
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')   // 英数字・スペース・ハイフン以外を除去
    .replace(/\s+/g, '-')       // スペースをハイフンに
    .replace(/-+/g, '-')        // 連続ハイフンを1つに
    .slice(0, 40)
    .replace(/^-|-$/g, '');     // 先頭・末尾のハイフンを除去

  const suffix = Math.random().toString(36).slice(2, 7);
  return base ? `${base}-${suffix}` : suffix;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { name, description } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json({ error: 'プロジェクト名は必須です' }, { status: 400 });
    }

    // スラッグの重複を避けるためリトライ
    let slug = generateSlug(name);
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) slug = generateSlug(name);

    const project = await prisma.project.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        slug,
        description: description?.trim() || null,
      },
      select: { id: true, name: true, slug: true, description: true, updatedAt: true },
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/projects]', err);
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 });
  }
}
