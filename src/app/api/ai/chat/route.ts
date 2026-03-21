import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateSectionEdit } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  try {
    const { sectionType, currentData, currentStyleOverrides, message } = await req.json();

    if (!sectionType || !currentData || !message?.trim()) {
      return NextResponse.json({ error: 'パラメータが不足しています' }, { status: 400 });
    }

    const result = await generateSectionEdit(
      message,
      currentData,
      currentStyleOverrides ?? {}
    );

    return NextResponse.json(result);
  } catch (err) {
    console.error('[POST /api/ai/chat]', err);
    return NextResponse.json({ error: 'AI 生成に失敗しました' }, { status: 500 });
  }
}
